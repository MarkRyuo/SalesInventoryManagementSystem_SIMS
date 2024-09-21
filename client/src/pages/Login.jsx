import { Row, Col, Button, Container } from 'react-bootstrap';
import { NavLogin } from '../components/NavBar/NavLogin';
import { LoginCard } from '../components/LogIn/LoginCard';
import { RiBox3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { LoginStyle } from './Pages_Cssmodules/Login.modules.css' ;

export const Login = () => {

    const navigate = useNavigate() ;

    const getNavigate = () => { 
        // * Alternative function for login direct to dashboard
        navigate("/Dashboard") 
    }


    return (
        <>
            <Container fluid className='mb-5'>
                <NavLogin/> {/** 100% width */}
            </Container>

            <Container fluid className={LoginStyle.containerSpace}>
                {/* Space */}
            </Container>

            <Container fluid='lg' className='d-flex justify-content-center text-center'>
                <Row style={{width: 450}}>
                    <Col lg={12}>
                        <RiBox3Fill size={80} />
                    </Col>
                    <Col lg={12}>
                        <p className='lead'>Sales Inventory Management System</p>
                    </Col>
                    <Col lg={12}>
                        <LoginCard/>
                    </Col>
                    <Col lg={12} className='mt-3'>
                        <Button variant="primary" size='lg' onClick={() => {
                        getNavigate()
                        }}>Log in</Button>
                    </Col>

                </Row>

            </Container>

        </>
    )
}