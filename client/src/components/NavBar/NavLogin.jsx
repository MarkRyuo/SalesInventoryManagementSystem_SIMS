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
                        <Col> <BsBox size={40} /> </Col>
                        <Col style={{ paddingTop: 4 }}>
                            <Navbar.Brand className="Nav-brand">SIMS</Navbar.Brand>
                        </Col>
                    </Row>

                    <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-split-basic" className="me-3">
                            Option
                        </Dropdown.Toggle>

                        {/* Dropdown function */}
                        <Dropdown.Menu style={{ width: 100 }}>
                            <Dropdown.Item as={Link} to='/SLogin' >Sales Inventory</Dropdown.Item> {/* Staff Account*/}
                            <Dropdown.Item as={Link} to='DeveloperPage' >Developer</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/AboutPage' >About</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </Container>
            </Navbar>
        </Container>

    )
}