import React from "react";
import { Header } from "./Navbar.style";
import { CDBNavbar, CDBInput } from "cdbreact";

const Navbar = ({user}) => {

	return (
        <Header style={{background:"#222", color:"#fff"}}>
          <CDBNavbar dark expand="md" scrolling >
            <div className="ml-2" style={{direction: 'ltr', fontFamily: "Calibri"}}>
              {user && user.photoURL?
              <div style={{padding: '8px', fontSize: '21px'}}>
                <img alt="panelImage" src={user.photoURL} style={{width:"2.5rem",height:"2.5rem", borderRadius: '50%'}}/>
                {" "}{user.displayName}
              </div>
              : 
              <div style={{paddingTop: '11px'}}>
                <h2 className='bi bi-person-circle'></h2>
              </div>
              }
            </div>
          </CDBNavbar>
        </Header>
	);
}

export default Navbar;
