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