import { Row, Col, Container, Navbar} from 'react-bootstrap';
import Navbars from './Navbar.module.scss';
import { Link } from "react-router-dom";


function NavStaffLogin() {
    return (
        <div>   
            <Container fluid className={Navbars.navLogin}> {/* fix sm-Screen 412px */}
                <Navbar>
                    <Container>
                        <Row>
                            <Col className="p-0 pt-1 ps-2">
                                <Link to={"/"} style={{ color: "rgb(19, 14, 1)", textDecoration: "none" }}>
                                    <p className="fs-5 fw-medium mt-2">Staff Portal</p>
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
