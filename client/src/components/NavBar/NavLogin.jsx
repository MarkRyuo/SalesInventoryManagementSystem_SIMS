import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { BsBox } from "react-icons/bs";

export const NavLogin = () => {

    return (

        <>
            <Navbar bg='light'>
                    <Container>
                        <Navbar.Brand href="#home">
                            <BsBox size={50}/>
                            SIMS
                        </Navbar.Brand>
                    </Container>
                </Navbar>
        </>

    )
}