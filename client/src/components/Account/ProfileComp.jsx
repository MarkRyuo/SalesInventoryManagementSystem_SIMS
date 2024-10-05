import { Row, Form, Col } from 'react-bootstrap';

const ProfileComp = () => {
    return (
        <Form style={{border: "1px solid"}}>

            <Row style={{border: "1px solid red", width: "100%", maxWidth: "700px", minWidth: "380px"}}>
                <Col sm={12}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control type="text" />
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