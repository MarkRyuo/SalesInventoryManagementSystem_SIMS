import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // ? firebase Config

const StaffComp = () => {
    const [staffData, setStaffData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        gender: ''
    });
    const [userDetails, setUserDetails] = useState(null); //? State to hold user details

    //? Simulated user data (replace this with your actual user data fetching logic)
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('userDetails'));
        if (loggedInUser) {
            setUserDetails(loggedInUser);
        }
    }, []);

    //? Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setStaffData({ ...staffData, gender: eventKey });
    };

    //? Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStaffData({ ...staffData, [name]: value });
    };

    // Function to add a new staff to Firestore
    const handleAddStaff = async () => {
        try {
            const staffDocRef = doc(db, 'staffs', staffData.username); // Using username as the document ID
            await setDoc(staffDocRef, staffData);
            alert('Staff added successfully.');
            // Optionally, clear the form fields after successful addition
            setStaffData({
                firstname: '',
                lastname: '',
                username: '',
                password: '',
                gender: ''
            });
        } catch (error) {
            console.error('Error adding staff:', error);
            alert('Failed to add staff. Please try again.');
        }
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
                    <Form.Group className="mb-3" controlId="firstname">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={staffData.firstname}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="lastname">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={staffData.lastname}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Dropdown (Male or Female) */}
            <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "11px" }}>
                <Form.Control
                    aria-label="Text input with dropdown button"
                    placeholder={staffData.gender || 'Select Gender'}
                    readOnly
                    value={staffData.gender}
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
            <Form.Group className="mb-3" controlId="username" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={staffData.username}
                    onChange={handleInputChange}
                />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="password" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={staffData.password}
                    onChange={handleInputChange}
                />
            </Form.Group>

            {/* Button Add */}
            <Button variant='primary' className='ms-2' onClick={handleAddStaff}>Add</Button>
        </Form>
    );
};

export default StaffComp;
