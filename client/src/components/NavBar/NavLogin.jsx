import { BsBox } from "react-icons/bs";
import { Row, Col, Container, Navbar, Dropdown } from 'react-bootstrap';
import Navbars from './Navbar.module.css';
import { Link } from 'react-router-dom';

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

                    <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-split-basic" className="me-5">
                            Option
                        </Dropdown.Toggle>

                        {/* Dropdown function */}
                        <Dropdown.Menu className="p-1">
                            <Dropdown.Item as={Link} to='/SLogin' >Staff Portal</Dropdown.Item> {/* Staff Account*/}
                            <Dropdown.Item as={Link} to='DeveloperPage' >Developer</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/AboutPage' >About</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </Container>
            </Navbar>
        </Container>

    )
}