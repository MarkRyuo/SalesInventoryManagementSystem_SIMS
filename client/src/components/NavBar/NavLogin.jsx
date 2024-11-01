import { BsBox } from "react-icons/bs";
import { Row, Col, Container, Navbar} from 'react-bootstrap';
import Navbars from './Navbar.module.css';

export const NavLogin = () => {

    return (

        <Container fluid className={Navbars.navLogin}> {/* fix sm-Screen 412px */}
            <Navbar>
                <Container>
                    <Row>
                        <Col> <BsBox size={40} className="d-none d-md-block"/> </Col>
                        <Col className="pt-1 m-0 p-0">
                            <Navbar.Brand className="Nav-brand">SIMS</Navbar.Brand>
                        </Col>
                    </Row>

                </Container>
            </Navbar>
        </Container>

    )
}