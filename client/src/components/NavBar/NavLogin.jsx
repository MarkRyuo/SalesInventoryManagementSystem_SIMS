import { Row, Col, Container, Navbar} from 'react-bootstrap';
import Navbars from './Navbar.module.scss';
import { Link } from 'react-router-dom';

export const NavLogin = () => {

    return (

        <Container fluid className={Navbars.navLogin}> {/* fix sm-Screen 412px */}
            <Navbar>
                <Container>
                    <Row>
                        <Col className="pt-1 m-0 p-0">
                            <Link to={"/"} style={{ color: "rgb(19, 14, 1)", textDecoration: "none" }}>
                                <Navbar.Brand className="Nav-brand">REYES ELECTRONICS</Navbar.Brand>
                            </Link>
                        </Col>
                    </Row>

                </Container>
            </Navbar>
        </Container>

    )
}