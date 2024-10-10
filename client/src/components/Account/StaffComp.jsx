import React, { useState } from 'react';
import { ref, push } from 'firebase/database'; // Import Realtime Database functions
import { db } from '../../firebase'; // Firebase config import
import { Form, Button, Row, Col, InputGroup, DropdownButton, Dropdown, Alert } from 'react-bootstrap';
import { auth } from '../../firebase'; // Firebase Auth import
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import registration function

const StaffComp = () => {
    const [staffData, setStaffData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: ''
    });

    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
    const [gender, setGender] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages

    // Handler to update state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaffData({
            ...staffData,
            [name]: value
        });
    };

    // Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey); // Updates the gender state with the selected value
    };

    // Function to handle changes in the confirm password input
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // Function to handle staff registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state
        setSuccess(''); // Reset success state

        // Check if passwords match
        if (staffData.password !== confirmPassword) {
            setError('Passwords do not match.');
            return; // Exit the function if passwords don't match
        }

        // Check for minimum password length
        if (staffData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            // Use the username as the email for Firebase
            const email = `${staffData.username}@example.com`;

            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, staffData.password);
            const user = userCredential.user;

            // Save staff data to Realtime Database
            await push(ref(db, 'staff'), {
                firstname: staffData.firstname,
                lastname: staffData.lastname,
                username: staffData.username,
                gender: gender,
                email: email // Store the generated email in the database
            });
            setSuccess('Staff registered and data saved successfully!');

            // Optionally, clear form after submission
            setStaffData({
                firstname: '',
                lastname: '',
                username: '',
                password: ''
            });
            setConfirmPassword(''); // Clear confirm password
            setGender('');

        } catch (error) {
            setError(`Error registering staff: ${error.message}`);
        }
    };

    return (
        <Form onSubmit={handleRegister}>
            {/* Success/Error Messages */}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* Row of firstName and lastName */}
            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control type="text" name="firstname" value={staffData.firstname} onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control type="text" name="lastname" value={staffData.lastname} onChange={handleChange} required />
                    </Form.Group>
                </Col>
            </Row>

            {/* Dropdown for Gender */}
            <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "11px" }}>
                <Form.Control
                    placeholder={gender || 'Select Gender'}
                    readOnly
                />
                <DropdownButton
                    variant="outline-secondary"
                    title="Dropdown"
                    onSelect={handleGenderSelect}
                >
                    <Dropdown.Item eventKey="Male">Male</Dropdown.Item>
                    <Dropdown.Item eventKey="Female">Female</Dropdown.Item>
                </DropdownButton>
            </InputGroup>

            {/* Username (used as email for Firebase) */}
            <Form.Group className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" value={staffData.username} onChange={handleChange} required />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={staffData.password} onChange={handleChange} required />
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
            </Form.Group>

            {/* Add Button */}
            <Button variant='primary' type='submit'>Register Staff</Button>
        </Form>
    );
}

export default StaffComp;
