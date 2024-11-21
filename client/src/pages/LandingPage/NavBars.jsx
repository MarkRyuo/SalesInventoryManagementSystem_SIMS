import { Container, Nav, Navbar, Button} from "react-bootstrap"
import LandingPagecss from './LandingPage.module.scss'
import { Link } from "react-router-dom"

function NavBars() {
    return (
        <Navbar expand="lg" className={LandingPagecss.Navbar}>
                <Container>
                <div>
                    <span className={LandingPagecss.logoNav}>
                        <img src="/Reyes_Electronics_LogoBg.png" />
                    </span>
                <Navbar.Brand href="#home" style={{ color: '#4b4b4b'}}>
                REYES ELECTRONICS
                </Navbar.Brand>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                        <Nav.Link href="#home" style={{ color: '#4b4b4b' }}>Home</Nav.Link>
                        <Nav.Link href="#Aboutus" style={{ color: '#4b4b4b' }}>About us</Nav.Link>
                        <Button as={Link} to={"/LoginPage"}>Login</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    )
}

export default NavBars
