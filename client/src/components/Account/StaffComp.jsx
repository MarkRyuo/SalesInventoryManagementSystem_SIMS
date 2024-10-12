import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { db } from '../../firebase'; // Ensure you import your Firebase config
import { collection, addDoc } from 'firebase/firestore';

const StaffComp = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            // Create a new staff member object
            const newStaffMember = {
                firstname,
                lastname,
                gender,
                username,
                password // In a real application, don't store passwords in plain text!
            };

            // Add the new staff member to Firestore
            const staffCollectionRef = collection(db, 'users'); // Adjust the collection name as needed
            await addDoc(staffCollectionRef, newStaffMember);

            alert("Staff member added successfully!"); // Notify the admin of success
            // Reset form fields
            setFirstname('');
            setLastname('');
            setGender('');
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error("Error adding staff member:", error);
            alert(`Failed to add staff member: ${error.message}`);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Row of firstName and lastName */}
            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="firstname">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)} // Update state on input change
                        />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="lastname">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)} // Update state on input change
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Dropdown (Male or Female) */}
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
                controlId="username"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Update state on input change
                />
            </Form.Group>

            {/* Password */}
            <Form.Group
                className="mb-3"
                controlId="password"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update state on input change
                />
            </Form.Group>

            {/* Button Add */}
            <Button variant='primary' className='ms-2' type="submit">Add</Button>
        </Form>
    );
};

export default StaffComp;
