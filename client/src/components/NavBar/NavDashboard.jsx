import {Container, Navbar, Button, Offcanvas} from 'react-bootstrap' ;
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from 'react';
import Navbars from './Navbar.module.css' ;

import { Buttons } from './Buttons';


export const NavDashboard = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        Sales Inventory
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <div className={Navbars.buttonOffcanvas}>
                        <Buttons />
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

        </Container>
    )
}