import React, { useContext, useState, useEffect } from 'react';
import { SharedData } from './root';
import { Col, Collapse, Row, Card, CardTitle, CardHeader, CardBody, CardFooter,
  Label, Badge, Table, Button, Form, Tooltip } from 'reactstrap';
import { PageTitle } from '../components/PageTitle';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { fetchNrProjects } from '../api/projects';
import { addInvite, fetchMyInvites } from '../api/invite';
import { TypeString, TypeColor } from '../config/map-projecttypes';
import ModalAreYouSure from '../components/ModalAreYouSure';
import { convertToEuropean } from '../utils/dates';
import { AuthContext } from '../components/AuthContextProvider';
import { CustomCreatableSelect, CustomReactSelect } from '../components/CustomReactSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPaperPlane,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'


function extractUsers(projectUsers, role) {
  let users = projectUsers.filter(user => (
    user['role']['name'] === role
  ))

  return users
}


function extractEmails(email) {
  const emails = email.split(';')

  if (emails.length > 0)
    return emails.join(', ')
  else
    return email
}


function emailInInvites(emails, invites) {
  let single_emails = emails.split(';')
  single_emails = single_emails.map(e => e.trim())

  for (var email of single_emails)
    if (invites.indexOf(email) !== -1)
      return true

  return false
}


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
      <Col className="text-left" md={{size: 2}}>
        Šifra:
        <div className="p-2 mt-2">
          <Badge color={"secondary fw-normal"}>
            { project.identifier }
          </Badge>
        </div>
      </Col>
      <Col md={{size: 3}}>
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
      <Col md={{size: 2}}>
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
      <Col md={{size: 2}}>
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


const UsersTableGeneral = ({project, invites, onSubmit}) => {
  const lead = extractUsers(project.userproject_set, 'lead')[0]
  const alreadyJoined = extractUsers(project.userproject_set, 'collaborator')
  const { userDetails } = useContext(AuthContext);
  const amILead = lead['user']['person_oib'] === userDetails.person_oib

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      collaboratorEmails: '',
    }
  });

  const onTableSubmit = (data) => {
    data['project'] = project['identifier']
    onSubmit(data)
  }

  const [tooltipOpened, setTooltipOpened] = useState(undefined);
  const showTooltip = (toolid) => {
    let showed = new Object()
    if (tooltipOpened === undefined && toolid) {
      showed[toolid] = true
      setTooltipOpened(showed)
    }
    else {
      showed = JSON.parse(JSON.stringify(tooltipOpened))
      showed[toolid] = !showed[toolid]
      setTooltipOpened(showed)
    }
  }
  const isOpened = (toolid) => {
    if (tooltipOpened !== undefined)
      return tooltipOpened[toolid]
  }

  return (
    <>
      <Row className={amILead ? 'mt-4 ms-4 me-4 mb-2' : 'mt-4 ms-4 me-4 mb-5'}>
        <Col>
          <Table responsive hover className="shadow-sm bg-white">
            <thead id="hzsi-thead" className="table-active align-middle text-center text-white">
              <tr className="border-bottom border-1 border-dark">
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
                  Prijavljen
                </th>
              </tr>
            </thead>
            <tbody>
              <>
                <tr>
                  <td className={
                    amILead
                    ? "p-3 align-middle text-center fst-italic border-bottom border-secondary"
                    : "p-3 align-middle text-center"
                  }>
                    { lead['user'].first_name }
                  </td>
                  <td className={
                    amILead
                    ? "p-3 align-middle text-center fst-italic border-bottom border-secondary"
                    : "p-3 align-middle text-center"
                  }>
                    { lead['user'].last_name }
                  </td>
                  <td className={
                    amILead
                    ? "align-middle text-center fst-italic border-bottom border-secondary"
                    : "align-middle text-center"
                  }>
                    Voditelj
                  </td>
                  <td className={
                    amILead
                    ? "align-middle text-center fst-italic border-bottom border-secondary"
                    : "align-middle text-center"
                    }>
                    { lead['user'].person_mail }
                  </td>
                  <td className={
                    amILead
                    ? "align-middle text-center text-success fst-italic border-bottom border-secondary"
                    : "align-middle text-center text-success"
                  }>
                    Da
                  </td>
                </tr>
                {
                  alreadyJoined.length > 0 && alreadyJoined.map((user, i) => (
                    <tr key={`row-${i}`}>
                      <td className={
                        user['user']['person_oib'] === userDetails.person_oib
                        ? "p-3 align-middle text-center fst-italic border-bottom border-secondary"
                        : "p-3 align-middle text-center"
                      }>
                        { user['user'].first_name }
                      </td>
                      <td className={
                        user['user']['person_oib'] === userDetails.person_oib
                        ? "p-3 align-middle text-center fst-italic border-bottom border-secondary"
                        : "p-3 align-middle text-center"
                      }>
                        { user['user'].last_name }
                      </td>
                      <td className={
                        user['user']['person_oib'] === userDetails.person_oib
                        ? "align-middle text-center fst-italic border-bottom border-secondary"
                        : "align-middle text-center"
                      }>
                        Suradnik
                      </td>
                      <td className={
                        user['user']['person_oib'] === userDetails.person_oib
                        ? "align-middle text-center fst-italic border-bottom border-secondary"
                        : "align-middle text-center"
                      }>
                        { user['user'].person_mail }
                      </td>
                      <td className={
                        user['user']['person_oib'] === userDetails.person_oib
                        ? "align-middle text-center text-success fst-italic border-bottom border-secondary"
                        : "align-middle text-center text-success"
                      }>
                        Da
                      </td>
                    </tr>
                  ))
                }
                {
                  invites?.length > 0 && invites.map((user, i) => (
                    <tr key={`row-${i + 100}`}>
                      <td className="p-3 align-middle text-center">
                        { '\u2212' }
                      </td>
                      <td className="p-3 align-middle text-center">
                        { '\u2212' }
                      </td>
                      <td className="align-middle text-center">
                        Suradnik
                      </td>
                      <td className="align-middle text-center">
                        { user.email }
                      </td>
                      <td className="align-middle text-center" id={`Tooltip-${i + 100}`}>
                        <FontAwesomeIcon className="text-success fa-lg" icon={faEnvelope}/>
                        <Tooltip
                          placement='top'
                          isOpen={isOpened(user.email)}
                          target={`Tooltip-${i + 100}`}
                          toggle={() => showTooltip(user.email)}
                        >
                          Aktivna pozivnica poslana na email
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                }
              </>
            </tbody>
          </Table>
        </Col>
      </Row>
      {
        amILead &&
          <Form onSubmit={handleSubmit(onTableSubmit)} className="needs-validation">
            <Row className="mt-3 mb-5">
              <Col>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Button color="primary" onClick={toggle}>
                      <FontAwesomeIcon icon={faArrowDown}/>{' '}
                      Pozovi suradnike
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={{size: 8, offset: 2}} className="d-flex justify-content-center">
                    <Collapse isOpen={isOpen} style={{width: '80%'}}>
                      <Card className="ps-4 pe-4 pt-4">
                        <CardTitle>
                          Upiši email adrese suradnika koje želiš pozvati na projekt
                        </CardTitle>
                        <CardBody className="mb-4">
                          <Controller
                            name="collaboratorEmails"
                            control={control}
                            render={ ({field}) =>
                              <CustomCreatableSelect
                                name="collaboratorEmails"
                                forwardedRef={field.ref}
                                placeholder="suradnik1@email.hr ENTER/TAB suradnik2@email.hr..."
                                fontSize="18px"
                                onChange={(e) => setValue('collaboratorEmails', e)}
                              />
                            }
                          />
                          <div className="d-flex align-items-center justify-content-center">
                            <Button className="mt-4 mb-1" color="success" id="submit-button" type="submit">
                              <FontAwesomeIcon icon={faPaperPlane}/>{' '}
                              Pošalji poveznice za prijavu
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Collapse>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
      }
    </>
  )
}


const UsersTableCroris = ({project, invites, onSubmit}) => {
  const { userDetails } = useContext(AuthContext);
  const [ emailInvites, setEmailInvites] = useState(undefined)
  const collaborators = project['croris_collaborators']
  const lead = extractUsers(project.userproject_set, 'lead')[0]
  const alreadyJoined = extractUsers(project.userproject_set, 'collaborator')
  let oibsJoined = new Set()
  alreadyJoined.forEach(user => oibsJoined.add(user['user']['person_oib']))
  const amILead = lead['user']['person_oib'] === userDetails.person_oib

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      collaboratorEmails: '',
    }
  });

  const onTableSubmit = (data) => {
    data['project'] = project['identifier']
    onSubmit(data)
  }

  const [tooltipOpened, setTooltipOpened] = useState(undefined);
  const showTooltip = (toolid) => {
    let showed = new Object()
    if (tooltipOpened === undefined && toolid) {
      showed[toolid] = true
      setTooltipOpened(showed)
    }
    else {
      showed = JSON.parse(JSON.stringify(tooltipOpened))
      showed[toolid] = !showed[toolid]
      setTooltipOpened(showed)
    }
  }
  const isOpened = (toolid) => {
    if (tooltipOpened !== undefined)
      return tooltipOpened[toolid]
  }

  useEffect(() => {
    setEmailInvites(invites)
  }, [invites])


  if (emailInvites !== undefined) {
    let email_invites = emailInvites.map(i => i.email)

    const missingCollab = new Array()
    collaborators.forEach((user) => {
      if (!oibsJoined.has(user['oib'])) {
        if (user['email'].includes(';')) {
          let emails = user['email'].split(';')
          for (var email of emails)
            if (email_invites.indexOf(email.trim()) === -1)
              missingCollab.push({...user, email: email.trim()})
        }
        else
          if (email_invites.indexOf(user['email']) === -1)
            missingCollab.push(user)
      }
    })

    let collabNoEmail = true
    for (var collab of missingCollab)
      if (collab['email'])
        collabNoEmail = false

    return (
      <>
        <Row className={amILead && missingCollab.length > 0 ? 'mt-4 ms-0 me-0 mb-2 p-0' : 'p-0 mt-4 ms-0 me-0 mb-5'}>
          <Col>
            <Table responsive hover className="shadow-sm bg-white m-0">
              <thead id="hzsi-thead" className="table-active align-middle text-center text-white">
                <tr className="border-bottom border-1 border-dark">
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
              <tbody>
                <>
                  <tr>
                    <td className={
                      amILead
                      ? 'p-3 align-middle text-center fst-italic border-bottom border-secondary'
                      : 'p-3 align-middle text-center'
                    }>
                      { lead['user'].first_name }
                    </td>
                    <td className={
                      amILead
                      ? 'p-3 align-middle text-center fst-italic border-bottom border-secondary'
                      : 'p-3 align-middle text-center'
                    }>
                      { lead['user'].last_name }
                    </td>
                    <td className={
                      amILead
                      ? 'align-middle text-center fst-italic border-bottom border-secondary'
                      : 'align-middle text-center'
                    }>
                      Voditelj
                    </td>
                    <td className={
                      amILead
                      ? 'align-middle text-center fst-italic border-bottom border-secondary'
                      : 'align-middle text-center'
                    }>
                      { extractEmails(lead['user'].person_mail) }
                    </td>
                    <td className={
                      amILead
                      ? 'align-middle text-center text-success fst-italic border-bottom border-secondary'
                      : 'p-3 align-middle text-center text-success'
                    }>
                      Da
                    </td>
                    <td className={
                      amILead
                      ? 'align-middle text-center text-success fst-italic border-bottom border-secondary'
                      : 'p-3 align-middle text-center text-success'
                    }>
                      Da
                    </td>
                  </tr>
                  {
                    alreadyJoined.length > 0 && alreadyJoined.map((user, i) => (
                      <tr key={`row-${i}`}>
                        <td className={
                          user['user']['person_oib'] === userDetails.person_oib
                          ? "p-3 align-middle text-center fst-italic border-bottom border-secondary"
                          : "p-3 align-middle text-center"
                        }>
                          { user['user'].first_name }
                        </td>
                        <td className={
                          user['user']['person_oib'] === userDetails.person_oib
                          ? "p-3 align-middle text-center fst-italic border-bottom border-secondary"
                          : "p-3 align-middle text-center"
                        }>
                          { user['user'].last_name }
                        </td>
                        <td className={
                          user['user']['person_oib'] === userDetails.person_oib
                          ? "align-middle text-center fst-italic border-bottom border-secondary"
                          : "align-middle text-center"
                        }>
                          Suradnik
                        </td>
                        <td className={
                          user['user']['person_oib'] === userDetails.person_oib
                          ? "align-middle text-center fst-italic border-bottom border-secondary"
                          : "align-middle text-center"
                        }>
                          { extractEmails(user['user'].person_mail) }
                        </td>
                        <td className={
                          user['user']['person_oib'] === userDetails.person_oib
                          ? "align-middle text-center text-success fst-italic border-bottom border-secondary"
                          : "align-middle text-center text-success"
                        }>
                          Da
                        </td>
                        <td className={
                          user['user']['person_oib'] === userDetails.person_oib
                          ? "align-middle text-center text-success fst-italic border-bottom border-secondary"
                          : "align-middle text-center text-success"
                        }>
                          Da
                        </td>
                      </tr>
                    ))
                  }
                  {
                    collaborators.length > 0 && collaborators.map((user, i) =>
                      !oibsJoined.has(user['oib']) &&
                        (
                          <tr key={`row-${i + 100}`}>
                            <td className={
                              user['user']?.oib === userDetails.person_oib
                              ? "p-3 align-middle text-center fst-italic border-bottom border-secondary"
                              : "p-3 align-middle text-center"
                              }>
                              { user.first_name }
                            </td>
                            <td className={
                              user['user']?.oib === userDetails.person_oib
                              ? "p-3 align-middle text-center fst-italic border-bottom border-secondary"
                              : "p-3 align-middle text-center"
                            }>
                              { user.last_name }
                            </td>
                            <td className={
                              user['user']?.oib === userDetails.person_oib
                              ? "align-middle text-center fst-italic border-bottom border-secondary"
                              : "align-middle text-center"
                            }>
                              Suradnik
                            </td>
                            <td className={
                              user['user']?.oib === userDetails.person_oib
                              ? "align-middle text-center fst-italic border-bottom border-secondary"
                              : "align-middle text-center"
                            }>
                              {
                                user.email
                                ?
                                  extractEmails(user.email)
                                :
                                  '\u2212'
                              }
                            </td>
                            <td className={
                              user['user']?.oib === userDetails.person_oib
                              ? "align-middle text-center fst-italic border-bottom border-secondary"
                              : "align-middle text-center"
                            }>
                              {
                                user.email
                                  ?
                                    <span className="text-success">
                                      Da
                                    </span>
                                  :
                                    <span className="text-danger">
                                      Ne
                                    </span>
                              }
                            </td>
                            <td className={
                              user['user']?.oib === userDetails.person_oib
                              ? "align-middle text-center fst-italic border-bottom border-secondary"
                              : "align-middle text-center"
                              }
                              id={'Tooltip-' + i + 100}
                            >
                              {
                                emailInInvites(user.email, email_invites)
                                  ?
                                    <React.Fragment>
                                      <FontAwesomeIcon className="text-success fa-lg" icon={faEnvelope}/>
                                      <Tooltip
                                        placement='top'
                                        isOpen={isOpened(user.email)}
                                        target={'Tooltip-' + i + 100}
                                        toggle={() => showTooltip(user.email)}
                                      >
                                        Aktivna pozivnica poslana na email
                                      </Tooltip>
                                    </React.Fragment>
                                  :
                                    <span className="text-danger">
                                      Ne
                                    </span>
                              }
                            </td>
                          </tr>
                        ))
                  }
                </>
              </tbody>
            </Table>
          </Col>
        </Row>
        {
          amILead && missingCollab.length > 0 &&
            <Form onSubmit={handleSubmit(onTableSubmit)} className="needs-validation">
              <Row className="mt-3 mb-5">
                <Col>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <Button disabled={collabNoEmail} color="primary" onClick={toggle}>
                        <FontAwesomeIcon icon={faArrowDown}/>{' '}
                        Pozovi suradnike
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md={{size: 8, offset: 2}} className="d-flex justify-content-center">
                      <Collapse isOpen={isOpen} style={{width: '80%'}}>
                        <Card className="ps-4 pe-4 pt-4">
                          <CardTitle>
                            Odaberi email adrese suradnika koje želiš pozvati na projekt
                          </CardTitle>
                          <CardBody className="mb-4">
                            <Controller
                              name="collaboratorEmails"
                              control={control}
                              render={ ({field}) =>
                                <CustomReactSelect
                                  name="collaboratorEmails"
                                  forwardedRef={field.ref}
                                  placeholder="Odaberi..."
                                  closeMenuOnSelect={false}
                                  collaboratorsFixedMultiValue
                                  isMulti
                                  fontSize="18px"
                                  options={
                                    missingCollab.map(user => (
                                      {
                                        'value': user.email,
                                        'label': user.email
                                      }
                                    ))}
                                  onChange={(e) => setValue('collaboratorEmails', e)}
                                />
                              }
                            />
                            <div className="d-flex align-items-center justify-content-center">
                              <Button className="mt-4 mb-1" color="success" id="submit-button" type="submit">
                                <FontAwesomeIcon icon={faPaperPlane}/>{' '}
                                Pošalji poveznice za prijavu
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </Collapse>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
        }
      </>
    )
  }
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
    setAreYouSureModal(!areYouSureModal)
    setModalTitle("Slanje pozivnica za istraživački projekt")
    setModalMsg("Da li ste sigurni da želite poslati pozivnice na navedene email adrese?")
    setOnYesCall('doaddinvite')
    setOnYesCallArg(data)
  }

  const doAdd = async (data) => {
    try {
      const ret = await addInvite(data)
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

  function onYesCallback() {
    if (onYesCall == 'doaddinvite') {
      doAdd(onYesCallArg)
    }
  }

  useEffect(() => {
    setPageTitle(LinkTitles(location.pathname))
    setInvitesSent(myInvites)
  }, [location.pathname, myInvites])

  if (nrStatus === 'success'
    && invitesStatus === 'success'
    && nrProjects) {
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
                      <CardBody className="mb-1 bg-light">
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
};

export default Memberships;
