import { Container, Row, Col, Nav} from 'react-bootstrap';
import { FaFacebookF, FaGoogle, FaInstagram, FaGem, FaHome, FaEnvelope, FaPhone } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-body-tertiary text-muted">
            {/* Social Media Section */}
            <div className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>
                <div>
                    <Nav className="justify-content-center">
                        <Nav.Link href="#" className="text-reset">
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
                        <h6 className="text-uppercase fw-bold mb-4">Partners</h6>
                        <Nav className="flex-column">
                            <Nav.Link href="https://www.fireflyelectric.com" className="text-reset">FELCO</Nav.Link>
                            <Nav.Link href="https://www.mosca-elektronik.de" className="text-reset">MOSCA</Nav.Link>
                            <Nav.Link href="https://www.chinafsl.com/en/index.php?ac=article&at=read&did=148" className="text-reset">FSL</Nav.Link>
                            <Nav.Link href="#https://www.tapo.com/ph/product/smart-camera" className="text-reset">Tapo</Nav.Link>
                        </Nav>
                    </Col>

                    <Col md={3} lg={2} xl={2} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
                        <Nav className="flex-column">
                            <Nav.Link href="#!" className="text-reset">Terms and Condition</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">Settings</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">Orders</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">Help</Nav.Link>
                        </Nav>
                    </Col>

                    <Col md={4} lg={3} xl={3} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                        <p><FaHome className="me-2" />Brgy 4, Rizal St. Lipa City Batangas</p>
                        <p><FaEnvelope className="me-2" /> rramilelectronics@gmail.com</p>
                        <p><FaPhone className="me-2" /> + 63 921 238 8866</p>
                    </Col>
                </Row>
            </Container>

            {/* Copyright */}
            <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2024 Copyright:
            </div>
        </footer>
    );
}

export default Footer;
