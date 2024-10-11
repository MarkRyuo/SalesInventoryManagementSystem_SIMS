import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { auth, db } from '../../firebase'; // Import auth and database instances
import { signInAnonymously } from "firebase/auth"; // For anonymous authentication
import { ref, set } from 'firebase/database'; // For adding staff data to the database

const StaffComp = () => {
    const [gender, setGender] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(''); // State for success or error messages

    // Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey); // Update the gender state with the selected value
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Basic validation
        if (!firstName || !lastName || !username || !password || !confirmPassword || !gender) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            // Create an anonymous user using Firebase Authentication
            const userCredential = await signInAnonymously(auth);
            const { uid } = userCredential.user; // Get the user ID (uid) of the anonymous user

            // Store staff data in the Realtime Database
            const staffRef = ref(db, `staff/${username}`);
            await set(staffRef, {
                firstName,
                lastName,
                gender,
                password, // Store the password for login validation later
                uid // Store the anonymous user ID for future reference
            });

            setMessage("Staff account created successfully!"); // Set success message

            // Clear form after successful submission (optional)
            setFirstName('');
            setLastName('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setGender('');
        } catch (err) {
            console.error("Error creating staff account:", err);
            setMessage("An error occurred while creating the account. Please try again.");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Display success or error message if available */}
            {message && <Alert variant="info">{message}</Alert>}

            {/* Row of firstName and lastName */}
            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} // Handle input change
                        />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} // Handle input change
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
                    onChange={(e) => setUsername(e.target.value)} // Handle input change
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
                    onChange={(e) => setPassword(e.target.value)} // Handle input change
                />
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group
                className="mb-3"
                controlId="confirmPassword"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} // Handle input change
                />
            </Form.Group>

            {/* Button Add */}
            <Button variant='primary' className='ms-2' type="submit">Add</Button>
        </Form>
    );
};

export default StaffComp;
