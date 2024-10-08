import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown} from 'react-bootstrap';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";


const ProfileComp = () => {
    //? Logics
    
    const [gender, setGender] = useState('');

    //* Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey); // * Update the gender state with the selected value
    };

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
            {/* DropDown (Male or Female) */}
            <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "11px" }}>
                <Form.Control
                    aria-label="Text input with dropdown button"
                    placeholder={gender || 'Select Gender'}
                    readOnly
                />
                <DropdownButton
                    variant="outline-secondary"
                    title="Dropdown"
                    id="input-group-dropdown-2"
                    align="end"
                    onSelect={handleGenderSelect}
                >
                    <Dropdown.Item eventKey="Male">Male</Dropdown.Item>
                    <Dropdown.Item eventKey="Female">Female</Dropdown.Item>
                </DropdownButton>
            </InputGroup>

            {/* Username */}
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" />
            </Form.Group>

            {/* Password */}
            <Form.Group 
                className="mb-3" 
                controlId="exampleForm.ControlInput1" 
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
            </Form.Group>

            {/* Email */}
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>

            {/* Button Connect to Google */}
            <Button variant="light" size='sm' className='ms-2'>
                <FcGoogle size={35} className='me-2' />
                Connect to Google
            </Button>

            {/* Container of button(Save, Edit) */}
            <div className='mt-3'>
                <Button variant='primary' className='ms-2'>Save</Button>
                <Button variant='primary' className='ms-2'>Edit</Button>
            </div>
        </Form>
    );
}

export default ProfileComp;