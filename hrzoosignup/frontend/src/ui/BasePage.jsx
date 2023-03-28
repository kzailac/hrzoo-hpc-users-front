import React from 'react'
import { Row, Col, Container } from 'reactstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './Navigation';
import NavigationLinks from './NavigationLinks';
import Footer from './Footer';
import BaseContent from './BaseContent';


const BasePage = () => {
  return (
    <Container fluid="xl" className="pt-1 d-flex flex-column">
      <ToastContainer />
      <Row>
        <Col>
          <Navigation />
          <NavigationLinks />
        </Col>
      </Row>
      <Row id="hzsi-contentwrap" className="pt-3 pb-3 border-start border-end rounded">
        <BaseContent />
      </Row>
      <Row>
        <Col>
          <Footer/>
        </Col>
      </Row>
    </Container>
  )
}

export default BasePage