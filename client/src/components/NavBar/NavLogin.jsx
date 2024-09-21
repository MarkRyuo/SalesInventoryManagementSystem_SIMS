import { BsBox } from "react-icons/bs";
import {Row, Col, Container, Button, Navbar, Dropdown} from 'react-bootstrap' ;

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
                                <Navbar.Brand>SIMS</Navbar.Brand>
                            </Col>
                        </Row>
                        {/* Hide Button if rage in small screen */}
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-split-basic" className="">
                                Select
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {/* <Button variant="outline-primary" className="d-none d-sm-block" onClick={() => {}}>Download App</Button> */}
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Container>
                </Navbar>
            </Container>
        </>

    )
}