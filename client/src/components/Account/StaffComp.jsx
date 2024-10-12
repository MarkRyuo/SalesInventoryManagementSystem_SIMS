import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const StaffComp = () => {
    const [gender, setGender] = useState('');
    const [userDetails, setUserDetails] = useState(null); // State to hold user details

    // Simulated user data (replace this with your actual user data fetching logic)
    useEffect(() => {
        // Example user details fetched from local storage or context
        const loggedInUser = JSON.parse(localStorage.getItem('userDetails')); // Replace with actual fetching logic
        if (loggedInUser) {
            setUserDetails(loggedInUser);
        }
    }, []);

    //* Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey); // Update the gender state with the selected value
    };

    return (
        <Form>
            {/* Display User Details */}
            {userDetails && (
                <div className="mb-3">
                    <h5>User Details</h5>
                    <p><strong>First Name:</strong> {userDetails.firstname}</p>
                    <p><strong>Last Name:</strong> {userDetails.lastname}</p>
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>Gender:</strong> {userDetails.gender}</p>
                </div>
            )}

            {/* Row of firstName and lastName */}
            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control type="text" defaultValue={userDetails ? userDetails.firstname : ''} />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control type="text" defaultValue={userDetails ? userDetails.lastname : ''} />
                    </Form.Group>
                </Col>
            </Row>

            {/* Dropdown(Male or Female) */}
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
                <Form.Control type="text" defaultValue={userDetails ? userDetails.username : ''} />
            </Form.Group>

            {/* Password  */}
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
            </Form.Group>

            {/* Button Add */}
            <Button variant='primary' className='ms-2'>Add</Button>
        </Form>
    );
}

export default StaffComp;
