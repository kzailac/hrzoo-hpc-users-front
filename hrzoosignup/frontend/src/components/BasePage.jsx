import React, { useState, useEffect,  useContext } from 'react'
import { Row, Col, Container } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './Navigation';
import NavigationLinks from './NavigationLinks';
import ModalAreYouSure from './ModalAreYouSure';
import Footer from './Footer';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/content.css';
import { doLogout } from '../api/auth';
import { fetchCroRIS } from '../api/croris';
import { AuthContext } from '../components/AuthContextProvider';
import { defaultUnAuthnRedirect} from '../config/default-redirect';
import { useQuery } from '@tanstack/react-query';
import HeadTitle from '../components/HeadTitle';

export const ModalContext = React.createContext();


const BasePage = ({sessionData=undefined}) => {
  const [areYouSureModal, setAreYouSureModal] = useState(false)
  const [noToast, setNoToast] = useState(false)
  const [modalTitle, setModalTitle] = useState(undefined)
  const [userMode, setUserMode] = useState(false);
  const [modalMsg, setModalMsg] = useState(undefined)
  const [onYesCall, setOnYesCall] = useState(undefined)
  const [onYesCallArg, setOnYesCallArg] = useState(undefined)
  const {
    logout: doLogoutContext,
    isLoggedIn, setUserdetails,
    setCsrfToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const {status, data: croRisData, error, failureReason, isFetching} = useQuery({
      queryKey: ['croris-info'],
      queryFn: fetchCroRIS,
      staleTime: 15 * 60 * 1000
  })

  if (status === 'error' && croRisData && !noToast)
    if (croRisData['status']['code'] !== 200 && !noToast) {
      // for person not having entry in CroRIS just skip silently
      if (!croRisData['status']['message'].includes('Ne postoji traženi resurs')
        || !croRisData['status']['message'].includes('Could not parse JSON data from CroRIS'))
        toast.error(
          <span className="font-monospace">
            { failureReason?.message }
          </span>, {
            theme: 'colored',
            autoClose: false,
            toastId: 'basepage-no-croris',
            onClose: () => setNoToast(true)
          }
        )
    }

  function onYesCallback() {
    if (onYesCall == 'dologout') {
      doLogout(sessionData.csrftoken)
      doLogoutContext()
    }
  }

  useEffect(() => {
    if (!(isLoggedIn || sessionData.active))
      navigate(defaultUnAuthnRedirect)
    else {
      sessionData?.userdetails && setUserdetails(sessionData.userdetails)
      sessionData?.csrftoken && setCsrfToken(sessionData.csrftoken)
    }
  }, [sessionData, isLoggedIn])

  if (isLoggedIn || sessionData.active)
    return (
      // TODO: <Container fluid={userMode ? "xl" : false} className="pt-1 d-flex flex-column" style={userMode ? {maxWidth: '1500px'} : {maxWidth: '100%'}}>
      <Container fluid="xl" className="pt-1 d-flex flex-column" style={{maxWidth: '1600px'}}>
        <HeadTitle />
        <ModalAreYouSure
          isOpen={areYouSureModal}
          toggle={() => setAreYouSureModal(!areYouSureModal)}
          title={modalTitle}
          msg={modalMsg}
          onYes={onYesCallback} />
        <ToastContainer/>
        <Row>
          <Col>
            <ModalContext.Provider
              value={{
                setAreYouSureModal, setModalTitle, setModalMsg, setOnYesCall,
                areYouSureModal, setOnYesCallArg
              }}
            >
              <Navigation />
              <NavigationLinks userMode={userMode} setUserMode={setUserMode} />
            </ModalContext.Provider>
          </Col>
        </Row>
        <Row id="hzsi-contentwrap" className="shadow-sm pt-3 pb-3 border-start border-end rounded">
          <Col>
            <Outlet />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Footer />
          </Col>
        </Row>
      </Container>
    )
  else
    return false
}

export default BasePage
