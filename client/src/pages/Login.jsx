import { Row, Col, Button, Container } from 'react-bootstrap';
import { NavLogin } from '../components/NavBar/NavLogin';
import { LoginCard } from '../components/LogIn/LoginCard';
import { RiBox3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import LoginStyle from './Css/Login.module.css' ;

export const Login = () => {

    const navigate = useNavigate() ;
    const getNavigate = () => { 
        // * Alternative function for login direct to dashboard
        navigate("/Dashboard") 
    }

    return (
        <>
            <Container fluid className='mb-5'> <NavLogin/> </Container> {/** 100% width */}

            <Container fluid className={LoginStyle.containerSpace}></Container> {/* Space */}

            <Container fluid='lg' className='d-flex justify-content-center text-center'>
                <Row className={LoginStyle.containerRow}>
                    <Col lg={12}> <RiBox3Fill size={80} /> </Col>
                    <Col lg={12}> <p className='lead fs-5'>Sales Inventory Management System</p> </Col>
                    <Col lg={12}> <LoginCard /> </Col>
                    <Col lg={12} className='mt-4'>
                        <Button variant="primary" className={LoginStyle.btnLogin} 
                        size='lg' onClick={() => {
                        getNavigate()
                        }}>Log in</Button>
                    </Col>
                    <Col lg={12} className='my-3'>
                        <p>or</p>
                        <Button variant="light" size='sm' className={LoginStyle.btnGoogle}>
                        <FcGoogle size={35} className='me-2'/>
                        Login with Google</Button>
                    </Col>

                </Row>

            </Container>

        </>
    )
}

export default Login ;