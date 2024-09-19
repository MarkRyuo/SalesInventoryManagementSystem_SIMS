import { BsBox } from "react-icons/bs";
import {Row, Col, Container, Button, Navbar} from 'react-bootstrap' ;

export const NavLogin = () => {

    return (

        <>
            <Navbar bg='light'>
                    <Container>
                        <Row>
                            <Col>
                                <Navbar.Brand href="#home" >
                                    SIMS
                                </Navbar.Brand>
                            </Col>

                            <Col>
                                <BsBox size={40}/>
                            </Col>

                            <Col>

                            </Col>
                        </Row>
                        <div style={{marginLeft: '30px'}}>
                            <BsBox size={40}/>
                        </div>
                        <Button variant="outline-primary">Download App</Button>
                    </Container>
                </Navbar>
        </>

    )
}