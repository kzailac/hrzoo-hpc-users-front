import React, { useState, useEffect, useContext } from 'react';
import { CustomReactSelect } from '../components/CustomReactSelect';
import { Outlet, useNavigate } from 'react-router-dom';
import { Col, Row, Button, Label } from 'reactstrap';
import { SharedData } from './root';
import { PageTitle } from '../components/PageTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { fetchCroRIS } from '../api/croris';
import { toast } from 'react-toastify';


const NewRequest = () => {
  const [pageTitle, setPageTitle] = useState(undefined)
  const [buttonDisabled, setButtonDisabled] = useState(undefined)
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(undefined)
  const [selectedProject, setSelectedProject] = useState(undefined)
  const navigate = useNavigate()
  const { LinkTitles,
    RequestTypesToSelect,
    UrlToRequestType } = useContext(SharedData);

  const {status, data: croRisData} = useQuery({
      queryKey: ['croris-info'],
      queryFn: fetchCroRIS,
      staleTime: 15 * 60 * 1000
  })

  useEffect(() => {
    setPageTitle(LinkTitles(location.pathname))
    if (location.pathname.endsWith('novi-zahtjev'))
      setButtonDisabled(false)
    else {
      setButtonDisabled(true)
      setSelectedProject(UrlToRequestType(location.pathname))
    }
  }, [location.pathname])

  return (
    <>
      <Row>
        <PageTitle pageTitle={pageTitle}/>
      </Row>
      <Row className="mb-2 ms-2 mt-4">
        <Col lg={{size: 9}} className="d-inline-flex align-items-center">
          <Label
            htmlFor="requestType"
            className="ps-2 pe-2 mt-1 pt-1 pb-1 text-white"
            aria-label="requestType"
            style={{backgroundColor: "#b04c46"}}
          >
            Tip zahtjeva:
          </Label>
          <CustomReactSelect
            id="requestType"
            aria-label="requestType"
            className="ms-5 shadow-sm"
            placeholder="Odaberi"
            controlWidth="40%"
            onChange={(e) => {
              if (e.value !== 'istrazivacki-projekt')
                setContinueButtonDisabled(false)
              else if (status === 'success' &&
                croRisData?.status?.code !== 200) {
                toast.error(
                  <span className="font-monospace text-dark">
                    Nema podataka iz sustava CroRIS
                  </span>, {
                    toastId: 'newreq-no-croris-data',
                    autoClose: 2500,
                  }
                )
                setContinueButtonDisabled(true)
              }
              else if (status === 'success' &&
                croRisData?.data?.person_info?.lead_status !== true) {
                toast.error(
                  <span className="font-monospace text-dark">
                    Nemate projekata prijavljenih u sustavu CroRIS
                  </span>, {
                    toastId: 'newreq-no-croris',
                    autoClose: 2500,
                  }
                )
                setContinueButtonDisabled(true)
              }
              return setSelectedProject(e)
            }}
            isDisabled={buttonDisabled}
            options={RequestTypesToSelect}
            value={selectedProject}
          />
          <Button
            color="success"
            className="ms-3"
            disabled={buttonDisabled || continueButtonDisabled}
            onClick={() => {
              if (!selectedProject)
                toast.warn(
                  <span className="font-monospace text-dark">
                    Morate odabrati jedan tip zahtjeva da biste nastavili
                  </span>, {
                    toastId: 'newreq-no-croris-data',
                    autoClose: 2500,
                  }
                )
              else
                navigate(selectedProject.value)
            }}>
            <FontAwesomeIcon icon={faArrowRight}/>{' '}
            Nastavi
          </Button>
        </Col>
        <Col lg={{size: 3}}>
        </Col>
      </Row>
      <Row>
        <Outlet />
      </Row>
    </>
  )
};

export default NewRequest;
