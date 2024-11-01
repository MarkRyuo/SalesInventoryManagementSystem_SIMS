import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"

function NavBars() {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">REYES ELECTRONICS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">About us</Nav.Link>
                            <NavDropdown title="User Type" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Admin Portal</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Staff Portal</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBars
