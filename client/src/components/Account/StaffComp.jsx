import { Row, Form, Col, Button } from 'react-bootstrap';
import DropDown from '../DropDown';
import { useState } from 'react';

const StaffComp = () => {

    const [staffData, setStaffData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: ''
    });

    // Handler to update state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaffData({
            ...staffData,
            [name]: value
        });
    };

    return (
        <Form>

            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control type="text" value={staffData.firstname} />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control type="text" value={staffData.lastname} />
                    </Form.Group>
                </Col>
            </Row>
            <DropDown />

            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={staffData.username} />
            </Form.Group>

            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={staffData.password} onChange={handleChange} />

            </Form.Group>

            <Button variant='primary' className='ms-2'>Add</Button>
        </Form>
    );
}

export default StaffComp;