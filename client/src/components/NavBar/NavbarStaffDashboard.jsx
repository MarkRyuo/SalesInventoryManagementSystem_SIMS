import { Container, Navbar, Button, Offcanvas, Image, Spinner, Modal } from 'react-bootstrap';
import { useState } from 'react';
import Navbars from './Navbar.module.scss';
import { Buttons } from './Buttons';
import { useNavigate } from 'react-router-dom';

//* Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { MdSpaceDashboard } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";

function NavbarStaffDashboard() {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //* Buttons
    const [buttons] = useState([
        { icon: <MdSpaceDashboard />, btnName: "Dashboard", id: "b-6", path: "/SDashboard" },
        { icon: <AiOutlineProduct />, btnName: "Account", id: "b-7", path: "/StaffAccountMode" },
        { icon: <FaHistory />, btnName: "TransactionHistory", id: "b-8", path: "/StaffTransactionHistory" },
        { icon: <VscAccount />, btnName: "Account", id: "b-9", path: "/AccountPage" },
        { icon: <RiLogoutCircleLine />, btnName: "Logout", id: "b-10", path: "/SLogin" }
    ]);

    // Handle logout process
    const handleLogout = () => {
        setLoading(true); // Start the loading state
        setTimeout(() => {
            localStorage.removeItem('staffId'); // Clear the stored staffId from localStorage
            setLoading(false); // End the loading state
            setShowLogoutModal(false); // Close the confirmation modal
            setShowSuccessModal(true); // Show the success modal
        }, 2000); // Simulate a delay (e.g., 2 seconds)
    };

    // Redirect to login after showing success modal
    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate("/"); // Redirect the user to the login page
    };

    // Modal control functions
    const handleShowLogoutModal = () => setShowLogoutModal(true);
    const handleCloseLogoutModal = () => setShowLogoutModal(false);

    return (
        <Container fluid style={{ margin: "0px", padding: "0px" }}>
            <Navbar className={Navbars.navDashboard}>
                <Container>
                    <Navbar.Brand>
                        <Button variant="" className={Navbars.btnOffcanvas} onClick={handleShow}>
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
                        <Image width={40} className='me-2' src="/Reyes_Electronics_LogoBg.png" rounded />
                        REYES ELECTRONICS
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <div className={Navbars.buttonOffcanvas}>
                        <div className={Navbars.buttonsList}>
                            <Buttons buttons={buttons.filter((button) => button.id === "b-6")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-7")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-8")} />
                        </div>
                        <div style={{ height: "150px" }}>
                            <Button
                                variant="light"
                                className={Navbars.btnOffcanvas}
                                onClick={handleShowLogoutModal}
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

            {/* Logout Confirmation Modal */}
            <Modal show={showLogoutModal} onHide={handleCloseLogoutModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Logging out, please wait...</p>
                        </div>
                    ) : (
                        <p>Are you sure you want to log out?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLogoutModal} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogout} disabled={loading}>
                        {loading ? "Logging Out..." : "Confirm Logout"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Logout Modal */}
            <Modal show={showSuccessModal} onHide={handleSuccessModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Logout Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You have successfully logged out.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSuccessModalClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default NavbarStaffDashboard;
