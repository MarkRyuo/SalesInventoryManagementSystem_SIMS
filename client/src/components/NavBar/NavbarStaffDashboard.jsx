import { Container, Navbar, Button, Offcanvas, Image, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import Navbars from './Navbar.module.css';
import { Buttons } from './Buttons';
import { useNavigate } from 'react-router-dom';

//* Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { MdSpaceDashboard } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutCircleLine } from "react-icons/ri";

function NavbarStaffDashboard() {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //* Buttons
    const [buttons] = useState([
        { icon: <MdSpaceDashboard />, btnName: "Dashboard", id: "b-6", path: "/SDashboard" },
        { icon: <AiOutlineProduct />, btnName: "Account", id: "b-7", path: "/StaffAccountMode" },
        { icon: <TbReportAnalytics />, btnName: "TransactionHistory", id: "b-8", path: "/TransactionHistory" },
        { icon: <VscAccount />, btnName: "Account", id: "b-9", path: "/AccountPage" },
        { icon: <RiLogoutCircleLine />, btnName: "Logout", id: "b-10", path: "/SLogin" }
    ]);

    // Handle logout with confirmation and loading
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            setLoading(true); // Start the loading state
            setTimeout(() => {
                localStorage.removeItem('staffId'); // Clear the stored staffId from localStorage
                setLoading(false); // End the loading state
                window.alert("You have successfully logged out."); // Show a success alert
                navigate("/SLogin"); // Redirect the user to the login page
            }, 2000); // Simulate a delay (e.g., 2 seconds)
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
                        <span className='fs-5 fw-bold'>SIMS</span> Staff Portal
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
                            <Buttons buttons={buttons.filter((button) => button.id === "b-6")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-7")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-8")} />
                            {/* Additional buttons can be added here if needed */}
                        </div>
                        <div style={{ height: "150px" }}>
                            <Button
                                variant="light"
                                className={Navbars.btnOffcanvas}
                                onClick={handleLogout}
                                disabled={loading} // Disable the button while loading
                            >
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Logging out...
                                    </>
                                ) : (
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
}

export default NavbarStaffDashboard;
