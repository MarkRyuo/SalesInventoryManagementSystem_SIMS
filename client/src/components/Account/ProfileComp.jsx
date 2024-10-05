import { Row, Form, Col } from 'react-bootstrap';

const ProfileComp = () => {
    return (
        <Form>

            <Row style={{width: "100%", margin: 0, padding: 0}}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{width: "100%", maxWidth: "400px"}}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>
        </Form>
    );
}

export default ProfileComp;