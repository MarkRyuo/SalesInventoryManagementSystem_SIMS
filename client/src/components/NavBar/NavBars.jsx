import { Container, Nav, Navbar, Dropdown } from "react-bootstrap"

function NavBars() {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="#home">SIMS</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#">Home</Nav.Link>
                        <Nav.Link href="#">About us</Nav.Link>
                        <Nav.Link href="#">Contacts</Nav.Link>
                    </Nav>
                </Container>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        User Type
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#">Admin Portal</Dropdown.Item>
                        <Dropdown.Item href="#">Staff Portal</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar>
        </>
    )
}

export default NavBars
