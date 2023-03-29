import React from 'react'
import SrceBigLogo from '../assets/pravisrce.png';
import { Link } from 'react-router-dom';
import '../styles/footer.css';


const Footer = () => {
  return (
    <div id="hzsi-footer" className="align-self-center border rounded pristupacnost">
      {
        //<div className="text-center mt-2">
          //<Link to="/ui/izjava-pristupacnost">
            //Izjava o pristupačnosti
          //</Link>
        //</div>
      }
      <div className="text-center pt-1 mt-2 pb-2">
        <a href="https://www.srce.unizg.hr/" target="_blank" rel="noopener noreferrer">
          <img src={SrceBigLogo} id="srcelogo" alt="SRCE Logo"/>
        </a>
      </div>
      <div className="text-center pt-1 pb-2">
        <p><small>Copyright © 2023 Sveučilišni računski centar (Srce)</small></p>
      </div>
    </div>
  )
}

export default Footer