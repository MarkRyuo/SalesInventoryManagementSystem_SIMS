import { Container, Navbar, Button, Offcanvas, Image } from 'react-bootstrap';
import { useState } from 'react';
import Navbars from './Navbar.module.css';
import { Buttons } from './Buttons';

//* Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { MdSpaceDashboard } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutCircleLine } from "react-icons/ri";




export const NavDashboard = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //* Buttons 
    const [buttons, setBottons] = useState([
        { icon: <MdSpaceDashboard />, btnName: "Dashboard", id: "b-1", path:"/DashboardPage" },
        { icon: <AiOutlineProduct />, btnName: "Product", id: "b-2", path: "/ProductPage" },
        { icon: <TbReportAnalytics />, btnName: "Report", id: "b-3", path: "/ReportPage" },
        { icon: <VscAccount />, btnName: "Account", id: "b-4", path: path: "/AccountPage" },
        { icon: <RiLogoutCircleLine />, btnName: "Logout", id: "b-5", path: "/" }
    ])



    return (

        <Container fluid>

            <Navbar className={Navbars.navDashboard}>
                <Container>
                    <Navbar.Brand>
                        <Button variant="light" className={Navbars.btnOffcanvas} onClick={handleShow}>
                            <GiHamburgerMenu size={20} />
                        </Button>
                        SIMS
                    </Navbar.Brand>
                </Container>
            </Navbar>

            {/* Off-canvas function */}

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton style={{ borderBottom: "1px solid", padding: "20px" }}>
                    <Offcanvas.Title>
                        <Image width={40} className='me-2' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvTQPW7YrgwGyYJ3o3tDB2hRSGOPUyCo8rnQ&s" rounded/>REYES ELECTRONICS
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <div className={Navbars.buttonOffcanvas} style={{height: "700px", padding: "15px"}}>
                        <div style={{height: "250px", display: 'flex', flexDirection: "column", justifyContent: 'space-between' }}>
                            <Buttons buttons={buttons.filter((button) => button.id === "b-1")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-2")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-3")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-4")} />
                        </div>
                        <div style={{height: "150px"}}>
                            <Buttons buttons={buttons.filter((button) => button.id === "b-5")} />
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

        </Container>
    )
}