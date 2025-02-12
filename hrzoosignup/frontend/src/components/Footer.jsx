import React from 'react'
import SrceBigLogo from '../assets/pravisrce.png';
import SrceLogoTiny from '../assets/srce-logo-e-mail-sig.png';
import '../styles/footer.css';


const Footer = () => {
  return (
    <div id="hzsi-footer" className="shadow-sm align-self-center border rounded pristupacnost">
      {
        //<div className="text-center mt-2">
          //<Link to="/ui/izjava-pristupacnost">
            //Izjava o pristupačnosti
          //</Link>
        //</div>
      }
      <div className="text-center pt-2 mt-2 pb-2">
        <a href="https://www.srce.unizg.hr/" target="_blank" rel="noopener noreferrer">
          <img src={SrceLogoTiny} id="srcelogo" alt="SRCE Logo"/>
        </a>
      </div>
      <div className="text-center pt-1 pb-2">
        <p>
          <small>Copyright © 2023{' '}
            <a href="https://www.srce.unizg.hr/" target="_blank" style={{'textDecoration': 'none'}} rel="noopener noreferrer">
              Sveučilišni računski centar (Srce)
            </a>
          </small>
        </p>
      </div>
    </div>
  )
}

export default Footer
