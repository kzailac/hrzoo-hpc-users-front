import React, { useContext, useState, useEffect } from 'react';
import { SharedData } from './root';
import { Col, Collapse, Row, Card, CardTitle, CardHeader, CardBody,
  Label, Badge, Table, Button, Form, Tooltip, Input } from 'reactstrap';
import { PageTitle } from '../components/PageTitle';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { fetchNrProjects } from '../api/projects';
import { addInvite, fetchMyInvites } from '../api/invite';
import { removeUserFromProject } from '../api/usersprojects';
import { TypeString, TypeColor } from '../config/map-projecttypes';
import ModalAreYouSure from '../components/ModalAreYouSure';
import { convertToEuropean } from '../utils/dates';
import { AuthContext } from '../components/AuthContextProvider';
import { CustomCreatableSelect, CustomReactSelect } from '../components/CustomReactSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPaperPlane,
  faArrowDown,
  faXmark,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { EmptyTableSpinner } from '../components/EmptyTableSpinner';
import _ from 'lodash';


export const BriefSummary = ({project, isSubmitted}) => {
  return (
    <>
      <Col md={{size: 12}}>
        <Label
          htmlFor="projectSummary"
          aria-label="projectSummary"
          className="mr-1 mt-2 form-label">
          Opis:
        </Label>
      </Col>
      <Col md={{size: 12}} className="mb-3">
        <textarea
          id="projectSummary"
          className="form-control fst-italic"
          rows="3"
          disabled={isSubmitted}
          style={{backgroundColor: "rgba(255, 255, 255, 0)"}}
          defaultValue={
            project.project_type.name === 'research-croris' ?
              project.croris_summary
            :
              project.reason
          }
        />
      </Col>
    </>
  )
}

const BriefProjectInfo = ({project}) => {
  return (
    <>
      <Col className="ms-4 text-left" md={{size: 2}}>
        Šifra:
        <div className="p-2 mt-2">
          <Badge color={"secondary fw-normal"}>
            { project.identifier }
          </Badge>
        </div>
      </Col>
      <Col md={{size: 3}} className="ms-4 ms-sm-4 ms-md-0">
        <Label
          htmlFor="projectTime"
          aria-label="projectTime"
          className="mr-1">
          Trajanje:
        </Label>
        <div className="p-2 fs-5 font-monospace">
          { convertToEuropean(project.date_start) } &minus; { convertToEuropean(project.date_end) }
        </div>
      </Col>
      <Col md={{size: 2}} className="ms-4 ms-sm-4 ms-md-0">
        <Label
          htmlFor="projectTime"
          aria-label="projectTime"
          className="mr-1">
          Odobren:
        </Label>
        <div className="p-2 fs-5 font-monospace">
          { convertToEuropean(project.date_changed) }
        </div>
      </Col>
      <Col md={{size: 2}} className="ms-4 ms-sm-4 ms-md-0">
        <Label
          htmlFor="projectType"
          aria-label="projectType"
          className="mr-1">
          Tip:
        </Label>
        <br/>
        <span className={`badge fw-normal ${TypeColor(project.project_type.name)}`} >
          { TypeString(project.project_type.name) }
        </span>
      </Col>
    </>
  )
}


const Memberships = () => {
  const { LinkTitles } = useContext(SharedData);
  const [pageTitle, setPageTitle] = useState(undefined);
  const [invitesSent, setInvitesSent] = useState(undefined);

  const [areYouSureModal, setAreYouSureModal] = useState(false)
  const [modalTitle, setModalTitle] = useState(undefined)
  const [modalMsg, setModalMsg] = useState(undefined)
  const [onYesCall, setOnYesCall] = useState(undefined)
  const [onYesCallArg, setOnYesCallArg] = useState(undefined)
  const { csrfToken } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const {status: nrStatus, data: nrProjects} = useQuery({
      queryKey: ['projects'],
      queryFn: fetchNrProjects
  })

  const {status: invitesStatus, data: myInvites} = useQuery({
      queryKey: ['invites'],
      queryFn: fetchMyInvites
  })

  const onSubmit = (data) => {
    if (data['type'] === 'add') {
      setAreYouSureModal(!areYouSureModal)
      setModalTitle("Slanje pozivnica za istraživački projekt")
      setModalMsg("Da li ste sigurni da želite poslati pozivnice na navedene email adrese?")
      setOnYesCall('doaddinvite')
      setOnYesCallArg(data)
    }
    else if (data['type'] === 'signoff') {
      setAreYouSureModal(!areYouSureModal)
      setModalTitle("Odjava suradnika sa istraživačkog projekta")
      setModalMsg("Da li ste sigurni da želite odjaviti označene suradnike?")
      setOnYesCall('dosignoff')
      setOnYesCallArg(data)
    }
  }

  const doAdd = async (data) => {
    try {
      const ret = await addInvite(data, csrfToken)
      queryClient.invalidateQueries('invites')
      toast.success(
        <span className="font-monospace text-dark">
          Pozivnice su uspješno poslane
        </span>, {
          toastId: 'invit-ok-sent',
          autoClose: 2500,
          delay: 500
        }
      )
    }
    catch (err) {
      toast.error(
        <span className="font-monospace text-white">
          Pozivnice nije bilo moguće poslati: <br/>
          { err.message }
        </span>, {
          theme: 'colored',
          toastId: 'invit-fail-sent',
          autoClose: 2500,
          delay: 1000
        }
      )
    }
  }

  const doSignoff = async (data) => {
    try {
      const ret = await removeUserFromProject(data['project'], data['remove_users'], csrfToken)
      queryClient.invalidateQueries('projects')
      toast.success(
        <span className="font-monospace text-dark">
          Suradnici su uspješno odjavljeni
        </span>, {
          toastId: 'signoff-ok',
          autoClose: 2500,
          delay: 500
        }
      )
    }
    catch (err) {
      toast.error(
        <span className="font-monospace text-white">
          Suradnike nije bilo moguće odjaviti: <br/>
          { err.message }
        </span>, {
          theme: 'colored',
          toastId: 'signoff-fail',
          autoClose: 2500,
          delay: 1000
        }
      )
    }
  }

  function onYesCallback() {
    if (onYesCall == 'doaddinvite')
      doAdd(onYesCallArg)
    if (onYesCall == 'dosignoff')
      doSignoff(onYesCallArg)
  }

  useEffect(() => {
    setPageTitle(LinkTitles(location.pathname))
    setInvitesSent(myInvites)
  }, [location.pathname, myInvites])

  if (nrStatus === 'success'
    && invitesStatus === 'success'
    && nrProjects && pageTitle) {
    let projectsApproved = nrProjects.filter(project =>
      project.state.name !== 'deny' && project.state.name !== 'submit'
    )

    return (
      <>
        <Row className="mb-5">
          <PageTitle pageTitle={pageTitle}/>
        </Row>
        <ModalAreYouSure
          isOpen={areYouSureModal}
          toggle={() => setAreYouSureModal(!areYouSureModal)}
          title={modalTitle}
          msg={modalMsg}
          onYes={onYesCallback} />
        {
          projectsApproved.length > 0 ?
            projectsApproved.map((project, i) =>
              <React.Fragment key={`projects-${i}`}>
                <Row className="mb-5" key={`row-${i}`}>
                  <Col key={`col-${i}`}>
                    <Card className="ms-3 bg-light me-3 shadow-sm" key={`card-${i}`}>
                      <CardHeader className="d-flex justify-content-between">
                        <span className="fs-5 fw-bold text-dark">
                          { project?.name }
                        </span>
                      </CardHeader>
                      <CardBody className="mb-1 bg-light p-0 m-0">
                        {
                          project.project_type.name === 'research-croris' ?
                            <UsersTableCroris project={project}
                              invites={invitesSent?.filter(inv =>
                                inv.project.identifier === project.identifier
                                && !inv.accepted
                              )}
                              onSubmit={onSubmit} />
                          :
                            <UsersTableGeneral
                              project={project}
                              invites={invitesSent?.filter(inv =>
                                inv.project.identifier === project.identifier
                                && !inv.accepted
                              )}
                              onSubmit={onSubmit} />
                        }
                        <Row>
                          <BriefProjectInfo project={project} />
                        </Row>
                        <Row>
                          {
                            // <BriefSummary project={project}/>
                          }
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row style={{height: '100px'}}/>
              </React.Fragment>
            )
          :
            <Row className="mt-3 mb-3">
              <Col className="d-flex align-items-center justify-content-center shadow-sm bg-light border border-danger rounded text-muted text-center p-3 fs-3" style={{height: '400px'}} md={{offset: 1, size: 10}}>
                Nemate prijavljenih sudjelovanja na odobrenim projektima
              </Col>
            </Row>
        }
      </>
    )
  }

  else if (nrStatus === 'loading' || invitesStatus === 'loading' && pageTitle)
    return (
      <React.Fragment>
        <Row className="mb-5">
          <PageTitle pageTitle={pageTitle}/>
        </Row>
        <Row className="mb-5">
          <Col>
            <Card className="ms-3 bg-light me-3 shadow-sm">
              <CardHeader className="d-flex justify-content-between">
                <span className="fs-5 fw-bold text-dark">
                  Ime projekta
                </span>
              </CardHeader>
              <CardBody className="mb-1 bg-light p-0 m-0">
                <EmptyTableSpinner colSpan={6} rowClass="ms-2 me-2 mb-2">
                  <thead id="hzsi-thead" className="align-middle text-center text-white">
                    <tr>
                      <th className="fw-normal">
                        Ime
                      </th>
                      <th className="fw-normal">
                        Prezime
                      </th>
                      <th className="fw-normal">
                        Uloga
                      </th>
                      <th className="fw-normal">
                        Email
                      </th>
                      <th className="fw-normal">
                        CroRIS registracija
                      </th>
                      <th className="fw-normal">
                        Prijavljen
                      </th>
                    </tr>
                  </thead>
                </EmptyTableSpinner>
                <Row>
                  <BriefProjectInfo project={{
                    'identifier': 'šifra',
                    'date_start': '2023-01-01',
                    'date_end': '2027-01-01',
                    'date_changed': '2026-01-01',
                    'project_type': Object({'name': 'research-croris'})
                  }} />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row style={{height: '100px'}}/>
      </React.Fragment>
    )
};

export default Memberships;
