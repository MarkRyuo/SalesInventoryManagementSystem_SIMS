import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { BsBox } from "react-icons/bs";
import Button from 'react-bootstrap/Button';

export const NavLogin = () => {

    return (

        <>
            <Navbar bg='light'>
                    <Container>
                        <Navbar.Brand href="#home" >
                            <BsBox size={40}/>
                            SIMS
                        </Navbar.Brand>
                        <Button variant="outline-primary">Download App</Button>
                    </Container>
                </Navbar>
        </>

    )
}