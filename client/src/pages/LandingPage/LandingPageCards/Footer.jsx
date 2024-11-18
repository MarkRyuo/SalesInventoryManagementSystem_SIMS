import { Container, Row, Col, Nav} from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaGithub, FaGem, FaHome, FaEnvelope, FaPhone, FaPrint } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-body-tertiary text-muted">
            {/* Social Media Section */}
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>
                <div>
                    <Nav className="justify-content-center">
                        <Nav.Link href="#" className="text-reset">
                            <FaFacebookF />
                        </Nav.Link>
                        <Nav.Link href="#" className="text-reset">
                            <FaTwitter />
                        </Nav.Link>
                        <Nav.Link href="#" className="text-reset">
                            <FaGoogle />
                        </Nav.Link>
                        <Nav.Link href="#" className="text-reset">
                            <FaInstagram />
                        </Nav.Link>
                        <Nav.Link href="#" className="text-reset">
                            <FaLinkedin />
                        </Nav.Link>
                        <Nav.Link href="#" className="text-reset">
                            <FaGithub />
                        </Nav.Link>
                    </Nav>
                </div>
            </section>

            {/* Links Section */}
            <Container className="text-center text-md-start mt-5">
                <Row className="mt-3">
                    <Col md={3} lg={4} xl={3} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">
                            <FaGem className="me-2" /> Company name
                        </h6>
                        <p>
                            Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        </p>
                    </Col>

                    <Col md={2} lg={2} xl={2} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Products</h6>
                        <Nav className="flex-column">
                            <Nav.Link href="#!" className="text-reset">Angular</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">React</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">Vue</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">Laravel</Nav.Link>
                        </Nav>
                    </Col>

                    <Col md={3} lg={2} xl={2} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
                        <Nav className="flex-column">
                            <Nav.Link href="#!" className="text-reset">Pricing</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">Settings</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">Orders</Nav.Link>
                            <Nav.Link href="#!" className="text-reset">Help</Nav.Link>
                        </Nav>
                    </Col>

                    <Col md={4} lg={3} xl={3} className="mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                        <p><FaHome className="me-2" /> New York, NY 10012, US</p>
                        <p><FaEnvelope className="me-2" /> info@example.com</p>
                        <p><FaPhone className="me-2" /> + 01 234 567 88</p>
                        <p><FaPrint className="me-2" /> + 01 234 567 89</p>
                    </Col>
                </Row>
            </Container>

            {/* Copyright */}
            <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2024 Copyright:
            <a className="text-reset fw-bold" href="https://mdbootstrap.com/"> modaOfficial.com</a>
            </div>
        </footer>
    );
}

export default Footer;