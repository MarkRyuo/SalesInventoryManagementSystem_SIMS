import { BsBox } from "react-icons/bs";
import { Row, Col, Container, Navbar} from 'react-bootstrap';
import Navbars from '../NavBar/Navbar.module.css';
import { Link } from "react-router-dom";


function NavStaffLogin() {
    return (
        <div>   
            <Container fluid className={Navbars.navLogin}> {/* fix sm-Screen 412px */}
                <Navbar>
                    <Container>
                        <Row>
                            <Col className="p-0 d-none d-md-block"> 
                                <Link to={"/"} style={{ color: "rgb(19, 14, 1)" }}>
                                    <BsBox size={40} />
                                </Link> 
                            </Col>
                            <Col className="p-0 pt-1 ps-2">
                                <Link to={"/"} style={{ color: "rgb(19, 14, 1)", textDecoration: "none" }}>
                                    <Navbar.Brand className="">Staff Portal</Navbar.Brand>
                                </Link>
                            </Col>
                        </Row>
                    </Container>
                </Navbar>
            </Container>
        </div>
    )
}

export default NavStaffLogin ;
