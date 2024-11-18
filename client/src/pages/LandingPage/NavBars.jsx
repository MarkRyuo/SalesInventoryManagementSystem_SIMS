import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import LandingPagecss from './LandingPage.module.scss'

function NavBars() {
    return (
        <Navbar expand="lg" className={LandingPagecss.Navbar}>
                <Container>
                <Navbar.Brand href="#home" style={{ color: '#ffffff' }}>REYES ELECTRONICS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                        <Nav.Link href="#home" style={{ color: '#ffffff' }}>Home</Nav.Link>
                        <Nav.Link href="#Aboutus" style={{ color: '#ffffff' }}>About us</Nav.Link>
                        <NavDropdown title={<span style={{ color: '#ffffff' }}>User Type</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="LoginPage">Admin Portal</NavDropdown.Item>
                                <NavDropdown.Item href="SLogin">Staff Portal</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="">
                                    Developer
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    )
}

export default NavBars
