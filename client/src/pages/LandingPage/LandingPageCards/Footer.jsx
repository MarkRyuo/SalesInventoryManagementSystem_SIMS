import { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { BsShop } from "react-icons/bs";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { FaFacebookF, FaGoogle, FaInstagram, FaGem, FaEnvelope, FaPhone } from "react-icons/fa";
import TermsModal from "./TermsModal"; // Import the modal

function Footer() {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <footer className="bg-body-tertiary text-muted" style={{ background: 'radial-gradient(788px at 0.7% 3.4%, rgb(164, 231, 192) 0%, rgb(245, 255, 244) 50%)' }}>
            {/* Social Media Section */}
            <div className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>
                <div>
                    <Nav className="justify-content-center">
                        <Nav.Link href="https://www.facebook.com/ReyesElectronics" className="text-reset">
                            <FaFacebookF />
                        </Nav.Link>
                        <Nav.Link href="#" className="text-reset">
                            <FaGoogle />
                        </Nav.Link>
                        <Nav.Link href="#" className="text-reset">
                            <FaInstagram />
                        </Nav.Link>
                    </Nav>
                </div>
            </div>

            {/* Links Section */}
            <Container className="text-center text-md-start mt-5">
                <Row className="mt-3">
                    <Col md={3} lg={4} xl={3} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">
                            <FaGem className="me-2" /> REYES ELECTRONICS
                        </h6>
                        <p>
                            Our mission is to bring affordable, high-quality electronics to every home, making technology accessible for everyone.
                        </p>
                    </Col>

                    <Col md={2} lg={2} xl={2} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-2">Partners</h6>
                        <Nav className="flex-column">
                            <Nav.Link href="https://www.fireflyelectric.com" className="text-reset">FELCO</Nav.Link>
                            <Nav.Link href="https://www.mosca-elektronik.de" className="text-reset">MOSCA</Nav.Link>
                            <Nav.Link href="https://www.chinafsl.com/en/index.php?ac=article&at=read&did=148" className="text-reset">FSL</Nav.Link>
                            <Nav.Link href="https://www.tapo.com/ph/product/smart-camera" className="text-reset">Tapo</Nav.Link>
                        </Nav>
                    </Col>

                    <Col md={3} lg={2} xl={2} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-2">About</h6>
                        <Nav className="flex-column">
                            <Nav.Link onClick={handleShow} className="text-reset p-0">Terms and Condition</Nav.Link>
                            <Nav.Link href="#!" className="text-reset p-0 pt-1">Developers</Nav.Link>
                        </Nav>
                    </Col>

                    <Col md={4} lg={3} xl={3} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-2">Contact</h6>
                        <p><BsShop className="me-2" />Brgy 4, Rizal St. Lipa City Batangas</p>
                        <p><FaShoppingCart className="me-2" /><a className="m-0 p-0 text-reset" href="https://shopee.ph/reyeselectronics">Our Online Shop</a></p>
                        <p><FaEnvelope className="me-2" /> rramilelectronics@gmail.com</p>
                        <p><FaPhone className="me-2" /> +63 921 238 8866</p>
                        <p><BsFillTelephoneFill className="me-2" />(043) 741-0922</p>
                    </Col>
                </Row>
            </Container>

            {/* Copyright */}
            <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
                © 2024 Copyright
            </div>

            {/* Terms Modal */}
            <TermsModal show={showModal} handleClose={handleClose} />
        </footer>
    );
}

export default Footer;
