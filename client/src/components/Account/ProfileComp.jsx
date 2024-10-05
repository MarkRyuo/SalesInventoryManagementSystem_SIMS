import { Row, Form, Col } from 'react-bootstrap';

const ProfileComp = () => {
    return (
        <Form>

            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control type="text" placeholder="n" />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>
        </Form>
    );
}

export default ProfileComp;