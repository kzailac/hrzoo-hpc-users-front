import React, { useContext, useState } from 'react';
import {
  Nav,
  NavItem,
  Badge,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileSignature,
  faBook,
  faUsers,
  faKey,
  faCircleInfo,
  faUserEdit,
  faStamp,
  faCertificate
} from '@fortawesome/free-solid-svg-icons';
import '../styles/nav.css';
import { AuthContext } from '../components/AuthContextProvider';
import { elemInArray } from '../utils/array_help';


const NavigationLinksUser = ({isAdmin, activeBgColor}) => {
  return (
    <>
      <NavItem key='moji-zahtjevi' className='ms-3 mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/moji-zahtjevi'>
          <FontAwesomeIcon icon={faBook} />{' '}
          Moji zahtjevi
        </NavLink>
      </NavItem>
      <NavItem key='novi-zahtjev' className='mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/novi-zahtjev'>
          <FontAwesomeIcon icon={faFileSignature} />{' '}
          Novi zahtjev
        </NavLink>
      </NavItem>
      <NavItem key='clanstva' className='mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/clanstva'>
          <FontAwesomeIcon icon={faUsers} />{' '}
          Članstva
        </NavLink>
      </NavItem>
      <NavItem key='javni-kljucevi' className='mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/javni-kljucevi'>
          <FontAwesomeIcon icon={faKey} />{' '}
          Javni ključevi
        </NavLink>
      </NavItem>
      <NavItem key='moji-podaci' className={isAdmin ? 'mt-1 ms-auto' : 'mt-1 me-3 ms-auto'}>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/moji-podaci'>
          <FontAwesomeIcon icon={faCircleInfo} />{' '}
          Moji podaci
        </NavLink>
      </NavItem>
    </>
  )
}


const NavigationLinksAdmin = ({activeBgColor}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);
  let userPages = ['novi-zahtjev', 'moji-zahtjevi', 'clanstva', 'javni-kljucevi']

  return (
    <>
      <NavItem key='upravljanje-zahtjevima' className='ms-3 mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/upravljanje-zahtjevima'>
          <FontAwesomeIcon icon={faStamp} />{' '}
          Upravljanje zahtjevima
        </NavLink>
      </NavItem>
      <NavItem key="projekti" className="mt-1">
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/projekti'
        >
          <FontAwesomeIcon icon={faCertificate} />{" "}
          Projekti
        </NavLink>
      </NavItem>
      <NavItem key="korisnici" className="mt-1">
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/korisnici'
        >
          <FontAwesomeIcon icon={faUsers} />{" "}
          Korisnici
        </NavLink>
      </NavItem>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        className="mt-1">
        <DropdownToggle nav caret
          style={elemInArray(location.pathname.split('/')[2], userPages) ? {'backgroundColor': activeBgColor, 'textColor': 'text-white'} : {}}
          className={elemInArray(location.pathname.split('/')[2], userPages) ? "text-white" : "text-dark"}>
          <FontAwesomeIcon icon={faUserEdit}/> Korisničke forme
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem className="ps-3 pe-3 p-2">
            <Link
              style={{textDecoration: "none"}}
              id="hzsi-navlinks-dropdown"
              className="text-dark ps-3 pe-3 p-2"
              to='/ui/moji-zahtjevi'>
              <FontAwesomeIcon icon={faBook} />{' '}
              Moji zahtjevi
            </Link>
          </DropdownItem>
          <DropdownItem className="ps-3 pe-3 p-2">
            <Link
              style={{textDecoration: "none"}}
              id="hzsi-navlinks-dropdown"
              className="text-dark ps-3 pe-3 p-2"
              to='/ui/novi-zahtjev'>
              <FontAwesomeIcon icon={faFileSignature} />{' '}
              Novi zahtjev
            </Link>
          </DropdownItem>
          <DropdownItem className="ps-3 pe-3 p-2">
            <Link
              style={{textDecoration: "none"}}
              className="text-dark ps-3 pe-3 p-2"
              id="hzsi-navlinks-dropdown"
              to='/ui/clanstva'>
              <FontAwesomeIcon icon={faUsers} />{' '}
              Članstva
            </Link>
          </DropdownItem>
          <DropdownItem className="ps-3 pe-3 p-2">
            <Link
              style={{textDecoration: "none"}}
              id="hzsi-navlinks-dropdown"
              className="text-dark ps-3 pe-3 p-2"
              to='/ui/javni-kljucevi'>
              <FontAwesomeIcon icon={faKey} />{' '}
              Javni ključevi
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <NavItem key='moji-podaci' className='mt-1 ms-auto'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/moji-podaci'>
          <FontAwesomeIcon icon={faCircleInfo} />{' '}
          Moji podaci
        </NavLink>
      </NavItem>
    </>
  )
}


const NavigationLinks = () => {
  const activeBgColor = '#b04c46';
  const { userDetails } = useContext(AuthContext);
  const [userMode, setUserMode] = useState(false);

  return (
    <Nav tabs id="hzsi-navlinks" className="border-start border-end rounded d-flex sticky-top">
      {
        (userDetails.is_staff || userDetails.is_superuser) && !userMode
        ?
          <>
            <NavigationLinksAdmin activeBgColor={activeBgColor} />
            <NavItem className='d-flex flex-column ms-3 me-3 justify-content-center'>
              <Badge
                size="sm"
                style={{cursor: 'pointer'}}
                onClick={() => setUserMode(!userMode)}
                color="danger">
                admin<br/>mode
              </Badge>
            </NavItem>
          </>
        :
          <>
            <NavigationLinksUser
              isAdmin={userDetails.is_staff || userDetails.is_superuser}
              activeBgColor={activeBgColor}
            />
            {
              (userDetails.is_staff || userDetails.is_superuser)
              &&
                <NavItem className='d-flex flex-column ms-3 me-3 justify-content-center'>
                  <Badge
                    size="sm"
                    style={{cursor: 'pointer'}}
                    onClick={() => setUserMode(!userMode)}
                    color="success">
                    user<br/>mode
                  </Badge>
                </NavItem>
            }
          </>
      }
    </Nav>
  )
}

export default NavigationLinks;
