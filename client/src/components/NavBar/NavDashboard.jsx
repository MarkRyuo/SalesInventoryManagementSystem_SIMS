import {Container, Navbar, Button, Offcanvas} from 'react-bootstrap' ;
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from 'react';


export const NavDashboard = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        
        <Container fluid>
            
            <Navbar className="bg-body-tertiary">
                <Container>

                    <Button variant="primary" onClick={handleShow}>
                        <GiHamburgerMenu size={30}/>  
                    </Button>
                    
                    <Navbar.Brand href="#home">
                        React Bootstrap
                    </Navbar.Brand>
                </Container>
            </Navbar>

        </Container>
    )
}