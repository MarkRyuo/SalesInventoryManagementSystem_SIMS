import {Container, Navbar, Button, Offcanvas, Image} from 'react-bootstrap' ;
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from 'react';
import Navbars from './Navbar.module.css' ;

import { Buttons } from './Buttons';


export const NavDashboard = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //* Buttons 
    const [buttons, setBottons] = useState([
        { btnName: "Dashboard", id: "b-1" },
    ])



    return (
        
        <Container fluid>
            
            <Navbar className={Navbars.navDashboard}>
                <Container>
                    <Navbar.Brand>
                        <Button variant="light" className={Navbars.btnOffcanvas} onClick={handleShow}>
                            <GiHamburgerMenu size={20}/>  
                        </Button>
                        SIMS
                    </Navbar.Brand>
                </Container>
            </Navbar>

            {/* Off-canvas function */}

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton style={{borderBottom: "1px solid", padding: "20px"}}>
                    <Offcanvas.Title>
                        <span><Image src="/client/src/assets/react.svg" rounded /></span>REYES ELECTRONICS
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <div className={Navbars.buttonOffcanvas}>
                        <Buttons buttons={buttons.filter((buttons) => buttons.id === "b-1")}/>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

        </Container>
    )
}