import { Row, Form, Col} from 'react-bootstrap';
import DropDown from '../DropDown';
import { useState } from 'react';

const ProfileComp = () => {

    const [] = useState([
        {},
        {},
        {}
    ])

    return (
        <Form>

            <Row style={{width: "100%", margin: 0, padding: 0}}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control type="text" value={}/>
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Col>
            </Row>
            <DropDown />

            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text"/>
            </Form.Group>

            <Form.Group 
                className="mb-3" 
                controlId="exampleForm.ControlInput1" 
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password"/>

            </Form.Group>
        </Form>
    );
}

export default ProfileComp;