import {Container, Navbar, Button, Offcanvas} from 'react-bootstrap' ;
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from 'react';
import Navbars from './Navbar.module.css' ;

import { MdDashboardCustomize } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";

export const NavDashboard = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        
        <Container fluid>
            
            <Navbar className={Navbars.navDashboard}>
                <Container>
                    <Navbar.Brand href="#home">
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
                        Admin Name
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <div className={Navbars.buttonOffcanvas}>
                        <Button variant="light"><MdDashboardCustomize size={25}/>Dashboard</Button>
                        <Button variant="light"><AiOutlineProduct size={25}/>Product</Button>
                        <Button variant="light"> <TbReportSearch size={25}/>Reports</Button>
                        <Button variant="light"><VscAccount size={20}/>Accounts</Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

        </Container>
    )
}