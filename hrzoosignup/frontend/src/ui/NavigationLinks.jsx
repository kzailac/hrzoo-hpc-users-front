import React from 'react';
import {
  Nav,
  NavItem,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import '../css/nav.css';


const NavigationLinks = () => {
  const activeBgColor = '#b04c46';

  return (
    <Nav tabs id="hzsi-navlinks" className="border-start border-end rounded d-flex justify-content-center sticky-top">
      <NavItem key='moji-zahtjevi' className='mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/moji-zahtjevi'>
          Moji zahtjevi
        </NavLink>
      </NavItem>
      <NavItem key='novi-zahtjev' className='mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/novi-zahtjev'>
          Novi zahtjev
        </NavLink>
      </NavItem>
      <NavItem key='iskoristenost-resursa' className='mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/iskoristenost-resursa'>
          Iskorištenost resursa
        </NavLink>
      </NavItem>
      <NavItem key='javni-kljucevi' className='mt-1'>
        <NavLink
          style={({isActive}) => isActive ? {'backgroundColor': activeBgColor} : {}}
          className={({isActive}) => isActive ? "nav-link active text-white" : "nav-link text-dark"}
          to='/ui/javni-kljucevi'>
          Javni ključevi
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default NavigationLinks;
