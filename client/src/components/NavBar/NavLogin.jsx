import { BsBox } from "react-icons/bs";
import { Row, Col, Container, Navbar} from 'react-bootstrap';
import Navbars from './Navbar.module.scss';
import { Link } from 'react-router-dom';

export const NavLogin = () => {

    return (

        <Container fluid className={Navbars.navLogin}> {/* fix sm-Screen 412px */}
            <Navbar>
                <Container>
                    <Row>
                        <Col className="d-none d-md-block"> 
                            <Link to={"/"} style={{ color: "rgb(19, 14, 1)" }}>
                                <BsBox size={40} className="d-none d-md-block" />
                            </Link> 
                        </Col>
                        <Col className="pt-1 m-0 p-0">
                            <Link to={"/"} style={{ color: "rgb(19, 14, 1)", textDecoration: "none" }}>
                                <Navbar.Brand className="Nav-brand">Reyes Electronics</Navbar.Brand>
                            </Link>
                        </Col>
                    </Row>

                </Container>
            </Navbar>
        </Container>

    )
}