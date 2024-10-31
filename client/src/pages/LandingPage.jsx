import { Container, Nav, Navbar } from "react-bootstrap"

function LandingPage() {
    return (
        <Container fluid>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">SIMS</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#">Home</Nav.Link>
                        <Nav.Link href="#">Features</Nav.Link>
                        <Nav.Link href="#">Pricing</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </Container>
    )   
}

export default LandingPage
