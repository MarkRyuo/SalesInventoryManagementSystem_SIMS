import Container from 'react-bootstrap/Container';
import { LoginCard } from '../components/Login Cards/LoginCard';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { NavLogin } from '../components/NavBar/NavLogin';


export const Login = () => {

    return (
        <>
            <Container fluid>
                
            </Container>
                <NavLogin/>
            <Container lg>
                <Row>
                    <Col lg={12}>
                        <LoginCard/>
                    </Col>
                    <Col lg={12}>
                        <Button variant="primary">Log in</Button>
                    </Col>
                </Row>

            </Container>

        </>
    )
}