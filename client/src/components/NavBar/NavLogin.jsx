import Navbar from 'react-bootstrap/Navbar';
import { BsBox } from "react-icons/bs";
import {Row, Container, Button} from 'react-bootstrap' ;

export const NavLogin = () => {

    return (

        <>
            <Navbar bg='light'>
                    <Container>
                        <Navbar.Brand href="#home" >
                            SIMS
                        </Navbar.Brand>
                        <div style={{marginLeft: '30px'}}>
                            <BsBox size={40}/>
                        </div>
                        <Button variant="outline-primary">Download App</Button>
                    </Container>
                </Navbar>
        </>

    )
}