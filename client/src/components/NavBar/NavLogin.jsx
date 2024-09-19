import { BsBox } from "react-icons/bs";
import {Row, Col, Container, Button, Navbar} from 'react-bootstrap' ;

export const NavLogin = () => {

    return (

        <>
            <Navbar bg='light'>
                    <Container>
                        <Row>
                            <Col>
                                <BsBox size={40}/>
                            </Col>
                            <Col>
                                <Navbar.Brand href="#home" >
                                    SIMS
                                </Navbar.Brand>
                            </Col>

                            <Col>
                                 <Button variant="outline-primary">Download App</Button>
                            </Col>
                        </Row>
                    </Container>
                </Navbar>
        </>

    )
}