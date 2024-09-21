import { BsBox } from "react-icons/bs";
import {Row, Col, Container, Navbar, Dropdown} from 'react-bootstrap' ;

export const NavLogin = () => {

    // * handleDownload
    return (

        <>
            <Container fluid className="py-2" style={{borderBottom: "1px solid  #f2f2f2"}}>
                <Navbar>
                    <Container>
                        <Row>
                            <Col>
                                <BsBox size={40}/>
                            </Col>
                            <Col style={{paddingTop:4}}>
                                <Navbar.Brand className="Nav-brand">SIMS</Navbar.Brand>
                            </Col>
                        </Row>
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-split-basic" className="me-5">
                                Select
                            </Dropdown.Toggle>

                            {/* Dropdown function */}
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1" onClick={() => {}}>Download App</Dropdown.Item> {/* App Files */}
                                <Dropdown.Item href="#/action-2" onClick={() => {}}>Developer</Dropdown.Item>
                                <Dropdown.Item href="#/action-3" onClick={() => {}}>About</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Container>
                </Navbar>
            </Container>
        </>

    )
}