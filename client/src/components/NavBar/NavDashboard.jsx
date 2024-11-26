import { Container, Navbar, Button, Offcanvas, Image, Modal, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import Navbars from './Navbar.module.scss';
import { Buttons } from './Buttons';

//* Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { MdSpaceDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutCircleLine } from "react-icons/ri";
import { MdOutlineInventory2 } from "react-icons/md";
import DropdownReports from '../Reports/DropdownReports';

export const NavDashboard = () => {
    const [show, setShow] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // For logout confirmation modal
    const [showSuccessModal, setShowSuccessModal] = useState(false); // For success modal

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleShowLogoutModal = () => setShowLogoutModal(true); // Show logout modal
    const handleCloseLogoutModal = () => setShowLogoutModal(false); // Close logout modal

    const handleCloseSuccessModal = () => setShowSuccessModal(false); // Close success modal

    //* Buttons
    const [buttons] = useState([
        { icon: <MdSpaceDashboard />, btnName: "Dashboard", id: "b-1", path: "/DashboardPage" },
        { icon: <MdOutlineInventory2 />, btnName: "Inventory", id: "b-2", path: "/ProductPage" },
        { icon: <TbReportAnalytics />, btnName: "Report", id: "b-3", path: "/ReportPage" },
        { icon: <VscAccount />, btnName: "Account", id: "b-4", path: "/AccountPage" },
    ]);

    //* Handle logout with confirmation and loading state
    const handleLogout = () => {
        setIsLoggingOut(true); // Start loading
        setTimeout(() => {
            localStorage.removeItem('adminId'); // Clear the stored adminId from localStorage
            setIsLoggingOut(false); // End loading state

            // Show success modal after logout
            setShowLogoutModal(false); // Close logout modal
            setShowSuccessModal(true); // Show success modal

            // Redirect after 2 seconds (adjust as needed)
            setTimeout(() => {
                window.location.href = "/"; // Redirect to login page
            }, 2000);
        }, 2000); // Simulate a 2-second loading time
    };

    return (
        <main className={Navbars.navDashboard}>
            <Navbar>
                <Container>
                    <Navbar.Brand>
                        <Button variant='' className={Navbars.btnOffcanvas} onClick={handleShow}>
                            <GiHamburgerMenu size={20} />
                        </Button>
                        SIMS
                    </Navbar.Brand>
                </Container>
            </Navbar>

            {/* Off-canvas function */}
            <Offcanvas show={show} onHide={handleClose} style={{ width: 320, background: "radial-gradient(800px at 0.7% 3.4%, rgb(164, 231, 192) 0%, rgb(245, 255, 244) 80%)" }}>
                <Offcanvas.Header closeButton className={Navbars.offCanvasHeader}>
                    <Offcanvas.Title>
                        <Image width={40} className='me-2'
                            src="/Reyes_Electronics_LogoBg.png" rounded />
                        REYES ELECTRONICS
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <div className={Navbars.buttonOffcanvas}>
                        <div className={Navbars.buttonsList}>
                            <Buttons buttons={buttons.filter((button) => button.id === "b-1")} />
                            <Buttons buttons={buttons.filter((button) => button.id === "b-2")} />
                            {/* <Buttons buttons={buttons.filter((button) => button.id === "b-3")} /> */}
                            <Buttons buttons={buttons.filter((button) => button.id === "b-4")} />
                            <DropdownReports />
                        </div>
                        <div style={{ height: "150px" }}>
                            <Button
                                variant="light"
                                className={Navbars.btnOffcanvas}
                                onClick={handleShowLogoutModal} // Show logout modal
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? (
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
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
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">Are you sure you want to log out?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLogoutModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogout} disabled={isLoggingOut}>
                        {isLoggingOut ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        ) : (
                            "Logout"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>Logout Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">You have successfully logged out.</p>
                </Modal.Body>
            </Modal>
        </main>
    );
};
