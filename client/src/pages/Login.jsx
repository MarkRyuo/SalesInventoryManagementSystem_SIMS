import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { NavLogin } from '../components/NavBar/NavLogin';
import { LoginCard } from '../components/LogIn/LoginCard';


export const Login = () => {

    return (
        <>
            <Container fluid>
                <NavLogin/>
            </Container>

            <Container lg className='d-flex justify-content-center'>
                <Row style={{width: 450}}>
                    <Col lg={12}>
                        <LoginCard/>
                    </Col>
                    <Col lg={12} className='mt-3 text-center'>
                        <Button variant="primary" size='lg'>Log in</Button>
                    </Col>

                </Row>

            </Container>

        </>
    )
}