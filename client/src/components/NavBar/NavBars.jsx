import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"

function NavBars() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary" style={{ height: 'auto', padding: 16, position: "sticky", top: 0, boxShadow: '2px 2px 4px rgb(168, 200, 255, 20%)', zIndex: 1000}}>
                <Container>
                    <Navbar.Brand href="#home">REYES ELECTRONICS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#">Home</Nav.Link>
                            <Nav.Link href="#">About us</Nav.Link>
                            <NavDropdown title="User Type" id="basic-nav-dropdown">
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
