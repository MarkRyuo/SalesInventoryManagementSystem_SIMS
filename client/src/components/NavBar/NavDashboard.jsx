import { Container, Navbar, Button, Offcanvas, Image } from 'react-bootstrap';
import { useState } from 'react';
import Navbars from './Navbar.module.css';
import { Buttons } from './Buttons';
import AccountDropdown from './AccountDropdown';

//* Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { MdSpaceDashboard } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";

export const NavDashboard = () => {
    const [show, setShow] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //* Buttons
    const [buttons] = useState([
        { icon: <MdSpaceDashboard />, btnName: "Dashboard", id: "b-1", path: "/DashboardPage" },
        { icon: <AiOutlineProduct />, btnName: "Product", id: "b-2", path: "/ProductPage" },
        { icon: <TbReportAnalytics />, btnName: "Report", id: "b-3", path: "/ReportPage" },
        { icon: <VscAccount />, btnName: "Account", id: "b-4", path: "/AccountPage" },
        { icon: <FaHistory />, btnName: "Transaction History", id: "b-5", path: "/AdminTransactionHistory" },
        { icon: <VscAccount />, btnName: "Account", id: "b-6", path: "/ProductEditor" },
    ]);

    //* Handle logout with confirmation and loading state
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            setIsLoggingOut(true); //* Start loading
            setTimeout(() => {
                localStorage.removeItem('adminId'); //? Clear the stored adminId from localStorage
                setIsLoggingOut(false); //* End loading state

                // Show window alert for successful logout
                window.alert("You have successfully logged out.");

                // Redirect after showing the alert
                window.location.href = "/LoginPage"; //? Redirect the user to the login page or home page
            }, 2000); //? Simulate a 2-second loading time (can adjust as needed)
        }
    };

    return (
        <Container fluid style={{ margin: "0px", padding: "0px" }}>
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
            <Offcanvas show={show} onHide={handleClose} style={{ width: 320 }}>
                <Offcanvas.Header closeButton className={Navbars.offCanvasHeader}>
                    <Offcanvas.Title>
                        <Image width={40} className='me-2'
                            src="/ReyesElectronicsLogo.png" rounded />
                        REYES ELECTRONICS
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <div className={Navbars.buttonOffcanvas}>
                        <div className={Navbars.buttonsList}>
                            <Buttons buttons={buttons.filter((button) => button.id === "b-1")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-2")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-3")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-5")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-6")} />
                            <AccountDropdown />
                        </div>
                        <div style={{ height: "150px" }}>
                            <Button
                                variant="light"
                                className={Navbars.btnOffcanvas}
                                onClick={handleLogout}
                                disabled={isLoggingOut} //? Disable the button while logging out
                            >
                                {isLoggingOut ? "Logging out..." : (
                                    <>
                                        <RiLogoutCircleLine size={20} className='me-2' /> Logout
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </Container>
    );
};
