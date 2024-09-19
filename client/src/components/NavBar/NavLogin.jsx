import { BsBox } from "react-icons/bs";
import {Row, Col, Container, Button, Navbar} from 'react-bootstrap' ;

export const NavLogin = () => {

    const handleDownload = () => {
        
    }

    return (

        <>
            <Container fluid className="pt-2" style={{borderBottom: "1px solid  #f2f2f2"}}>
                <Navbar>
                    <Container>
                        <Row>
                            <Col>
                                <BsBox size={40}/>
                            </Col>
                            <Col style={{paddingTop:4}}>
                                <Navbar.Brand href="#home" >SIMS</Navbar.Brand>
                            </Col>
                        </Row>
                        <Button variant="outline-primary" onClick={() => {}}>Download App</Button>
                    </Container>
                </Navbar>
            </Container>
        </>

    )
}