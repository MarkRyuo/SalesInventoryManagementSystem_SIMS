import { Row, Col, Container } from 'react-bootstrap';
import { NavLogin } from '../../components/NavBar/NavLogin';
import { LoginCard } from '../../components/LogIn/LoginCard';
import { RiBox3Fill } from "react-icons/ri";
import LoginStyle from './Login.module.scss' ;

export const LoginPage = () => {


    return (
        <>
            <Container fluid className='mb-5 p-0'> <NavLogin/> </Container> {/** 100% width */}

            <Container fluid className={LoginStyle.containerSpace}></Container> {/* Space */}
            <Container fluid='lg' className='d-flex justify-content-center text-center'>
                <Row className={LoginStyle.containerRow}> {/* fix sm-screen 412 px */}
                    <Col lg={12}> 
                        <RiBox3Fill size={80} /> 
                    </Col>
                    <Col lg={12}> 
                        <p className='lead fs-5 mb-3'>Sales Inventory Management System</p> </Col>
                    <Col lg={12}> <LoginCard /> </Col>
                </Row>

            </Container>

        </>
    )
}

export default LoginPage ;