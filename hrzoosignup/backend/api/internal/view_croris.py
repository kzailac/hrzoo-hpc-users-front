from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.conf import settings
from django.core.cache import cache
from django.contrib.auth import get_user_model

import asyncio
import aiohttp
import json
import datetime
import logging

from aiohttp import client_exceptions, http_exceptions, ClientSession


logger = logging.getLogger('hrzoosignup.views')


def contains_exception(list):
    for a in list:
        if isinstance(a, Exception):
            return (True, a)

    return (False, None)


class CroRISInfo(APIView):
    def __init__(self):
        self.person_info, \
        self.projects_lead_info, \
        self.projects_associate_info = None, None, None
        self.projects_lead_users = {}

        self.dead_projects_associate, \
        self.dead_projects_lead, \
        self.projects_lead_ids, \
        self.projects_associate_ids = [], [], [], []

    def get(self, request):
        oib = request.user.person_oib

        # we don't set HTTP error statuses on failed data fetchs
        try:
            if oib:
                self.loop = asyncio.new_event_loop()
                asyncio.set_event_loop(self.loop)

                self.loop.run_until_complete(self._fetch_serie(oib))
                self.loop.close()

                user = get_user_model().objects.get(id=self.request.user.id)
                user.croris_first_name = self.person_info.get('first_name', '')
                user.croris_last_name = self.person_info.get('last_name', '')
                user.croris_mail = self.person_info.get('email', '')
                user.save()

                # frontend is calling every 15 min
                # we set here eviction after 20 min
                cache.set(f'{oib}_croris', {
                        'person_info': self.person_info,
                        'projects_lead_info': self.projects_lead_info,
                        'projects_lead_users': self.projects_lead_users,
                        'projects_associate_info': self.projects_associate_info,
                        'projects_associate_ids': self.projects_associate_ids,
                    }, 20 * 60
                )

                return Response({
                    'data': {
                        'person_info': self.person_info,
                        'projects_lead_info': self.projects_lead_info,
                        'projects_lead_users': self.projects_lead_users,
                        'projects_associate_info': self.projects_associate_info,
                        'projects_associate_ids': self.projects_associate_ids,
                    },
                    'status': {
                        'code': status.HTTP_200_OK,
                        'message': 'Successfully fetched the data from CroRIS'
                    }
                })
            elif not oib:
                return Response({
                    'status': {
                        'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                        'message': 'Could not get authentication info from database'
                    }
                })

        except (client_exceptions.ServerTimeoutError, asyncio.TimeoutError) as exc:
            return Response({
                'status': {
                    'code': status.HTTP_408_REQUEST_TIMEOUT,
                    'message': 'Could not get data from CroRIS - {}'.format(repr(exc))
                }
            })

        except (client_exceptions.ClientError, http_exceptions.HttpProcessingError) as exc:
            return Response({
                'status': {
                    'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                    'message': 'Could not parse data from CroRIS - {}'.format(repr(exc))
                }
            })

    async def _fetch_data(self, url):
        headers = {'Accept': 'application/json'}
        async with self.session.get(url, headers=headers, auth=self.auth) as response:
            content = await response.text()
            if content:
                return content

    async def _fetch_serie(self, oib):
        client_timeout = aiohttp.ClientTimeout(total=20)
        self.session = ClientSession(timeout=client_timeout)
        self.auth = aiohttp.BasicAuth(settings.CRORIS_USER,
                                      settings.CRORIS_PASSWORD)

        await self.fetch_person_lead(oib.strip())
        await self.fetch_project_lead_info()
        await self.fetch_project_associate_info()
        await self.fetch_users_projects_lead()
        await self.filter_unverified()
        await self.extract_email_for_associate()
        await self.close_session()

    async def fetch_person_lead(self, oib):
        fetch_data = await self._fetch_data(settings.API_PERSONLEAD.replace("{persOib}", oib))
        fetch_data  = json.loads(fetch_data)
        httpcode = fetch_data.get('httpStatusCode', False)
        if httpcode and httpcode != 200:
            raise client_exceptions.ClientError({
                'status': fetch_data['httpStatusCode'],
                'message': fetch_data['errorMessage']
            })

        self.person_info = fetch_data
        # lead_status set from fetch_project_lead_info as projects might be
        # dead
        project_links = self.person_info['_links'].get('projekt', None)
        self.person_info = {
            'first_name': self.person_info['ime'],
            'last_name': self.person_info['prezime'],
            'croris_id': self.person_info['persId'],
            'lead_status': False,
            'project_lead_links': project_links
        }

    async def fetch_project_lead_info(self):
        coros = []
        parsed_projects = []

        projects = self.person_info['project_lead_links']
        if projects:
            if isinstance(projects, list):
                for project in projects:
                    coros.append(self._fetch_data(project['href']))
            else:
                coros.append(self._fetch_data(projects['href']))

            self.projects_lead_info = await asyncio.gather(*coros,
                                                           loop=self.loop,
                                                           return_exceptions=True)
            exc_raised, exc = contains_exception(self.projects_lead_info)
            if exc_raised:
                raise client_exceptions.ClientError(repr(exc))

            for project in self.projects_lead_info:
                project = json.loads(project)
                metadata = {}
                metadata['end'] = project.get('kraj', None)
                # projects may be outdated
                if metadata['end']:
                    today = datetime.datetime.today()
                    end_date = datetime.datetime.strptime(metadata['end'], '%d.%m.%Y') + datetime.timedelta(days=settings.GRACE_DAYS)
                    if end_date <= today:
                        self.dead_projects_lead.append(project.get('id'))
                        continue
                metadata['start'] = project.get('pocetak', None)
                if 'tipProjekta' in project:
                    metadata['type'] = project.get('tipProjekta').get('naziv', None)
                metadata['croris_id'] = project.get('id')
                self.projects_lead_ids.append(metadata['croris_id'])
                metadata['identifier'] = project.get('hrSifraProjekta', None)
                titles = project['title']
                for title in titles:
                    if title['cfLangCode'] == 'hr':
                        metadata['title'] = title['naziv']
                        break
                summaries = project['summary']
                for summary in summaries:
                    if summary['cfLangCode'] == 'hr':
                        metadata['summary'] = summary.get('naziv', '')
                        break

                institute = project['ustanoveResources']
                if institute and institute.get('_embedded', False):
                    institute = institute['_embedded']['ustanove'][0]
                    metadata['institute'] = {
                        'class': institute['klasifikacija']['naziv'],
                        'name': institute['naziv']
                    }

                finance = project['financijerResources']
                if finance and finance.get('_embedded', False):
                    finance = finance['_embedded']['financijeri'][0]
                    metadata['finance'] = finance['entityNameHr']

                parsed_projects.append(metadata)

            self.projects_lead_info = parsed_projects

            if self.projects_lead_info:
                self.person_info['lead_status'] = True

    async def fetch_project_associate_info(self):
        coros = []
        parsed_projects = []
        persid = self.person_info['croris_id']

        projects_associate_links = await self._fetch_data(settings.API_PERSON.replace("{persId}", str(persid)))
        projects_associate_links = json.loads(projects_associate_links)['_links'].get('projekt', None)
        if not isinstance(projects_associate_links, list):
            projects_associate_links = [projects_associate_links]

        skip_projects = self.dead_projects_lead + self.projects_lead_ids
        if skip_projects:
            projects_associate_links = list(
                filter(lambda l: int(l['href'].split('/')[-1]) not in skip_projects,
                    projects_associate_links))

        for project in projects_associate_links:
            coros.append(self._fetch_data(project['href']))

        self.projects_associate_info = await asyncio.gather(*coros,
                                                            loop=self.loop,
                                                            return_exceptions=True)

        exc_raised, exc = contains_exception(self.projects_associate_info)
        if exc_raised:
            raise client_exceptions.ClientError(repr(exc))

        for project in self.projects_associate_info:
            project = json.loads(project)
            metadata = {}
            metadata['end'] = project.get('kraj', None)
            # projects may be outdated
            if metadata['end']:
                today = datetime.datetime.today()
                end_date = datetime.datetime.strptime(metadata['end'], '%d.%m.%Y') +  datetime.timedelta(days=settings.GRACE_DAYS)
                if end_date <= today:
                    self.dead_projects_associate.append(project.get('id'))
                    continue
            metadata['start'] = project.get('pocetak', None)
            metadata['croris_id'] = project.get('id')
            self.projects_associate_ids.append(metadata['croris_id'])
            metadata['identifier'] = project.get('hrSifraProjekta', None)
            titles = project['title']
            for title in titles:
                if title['cfLangCode'] == 'hr':
                    metadata['title'] = title['naziv']
                    break
            summaries = project['summary']
            for summary in summaries:
                if summary['cfLangCode'] == 'hr':
                    metadata['summary'] = summary.get('naziv', '')
                    break
            parsed_projects.append(metadata)

        self.projects_associate_info = parsed_projects

    async def filter_unverified(self):
        coros = []
        filter_ids = list()

        for pid in self.projects_associate_ids:
            coros.append(self._fetch_data(settings.API_PROJECT.replace("{projectId}", str(pid))))
        fetched_projects = await asyncio.gather(*coros, loop=self.loop,
                                                return_exceptions=True)

        exc_raised, exc = contains_exception(fetched_projects)
        if exc_raised:
            raise client_exceptions.ClientError(repr(exc))

        for fetched_project in fetched_projects:
            project = json.loads(fetched_project)
            verified = project.get('verified', False)
            if verified and verified.lower() == 'false':
                filter_ids.append(project['id'])
            self.projects_associate_ids = list(filter(
                lambda e: e not in filter_ids,
                self.projects_associate_ids
            ))
            self.projects_associate_info = list(filter(
                lambda p: p['croris_id'] not in filter_ids,
                self.projects_associate_info
            ))

    async def extract_email_for_associate(self):
        if not self.person_info['lead_status']:
            try:
                pid = self.projects_associate_ids[0]
                fetched_project = await self._fetch_data(settings.API_PROJECT.replace("{projectId}", str(pid)))
                project = json.loads(fetched_project)

                for person in project['osobeResources']['_embedded']['osobe']:
                    if person['persId'] == self.person_info['croris_id']:
                        self.person_info['email'] = person.get('email', '')
            except (IndexError, ValueError) as exp:
                pass

    async def fetch_users_projects_lead(self):
        coros = []
        project_users = []
        persid = self.person_info['croris_id']

        for pid in self.projects_lead_ids:
            coros.append(self._fetch_data(settings.API_PERSONPROJECT.replace("{projectId}", str(pid))))

        project_users = await asyncio.gather(*coros, loop=self.loop,
                                             return_exceptions=True)

        exc_raised, exc = contains_exception(project_users)
        if exc_raised:
            raise client_exceptions.ClientError(repr(exc))

        i = 0
        for project in project_users:
            project = json.loads(project)
            pid = self.projects_lead_ids[i]
            if pid not in self.projects_lead_users:
                self.projects_lead_users[pid] = []
            for user in project['_embedded']['osobe']:
                if user['klasifikacija']['naziv'] == 'voditelj':
                    self.person_info['email'] = user.get('email', '')
                    continue
                self.projects_lead_users[pid].append(
                    {
                        'first_name': user['ime'],
                        'last_name': user['prezime'],
                        'oib': user.get('oib', ''),
                        'email': user.get('email', ''),
                        'institution': user['ustanovaNaziv']
                    }
                )
            i += 1

    async def close_session(self):
        await self.session.close()
