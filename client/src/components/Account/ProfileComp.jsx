import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { auth } from '../../firebase'; // Firebase setup
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from '../../firebase'; // Firebase Firestore
import { setDoc, doc } from "firebase/firestore"; // Firestore functions

const ProfileComp = () => {
    // Profile Data State
    const [profileData, setProfileData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: ''
    });

    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    // Handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey);
    };

    // Handle staff login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Log in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, profileData.password);
            const user = userCredential.user;

            // Save staff data to Firestore
            await setDoc(doc(db, "staff", user.uid), {
                firstname: profileData.firstname,
                lastname: profileData.lastname,
                username: profileData.username,
                gender: gender,
                email: email
            });

            setSuccess('Staff logged in and data saved successfully!');
        } catch (err) {
            setError(`Error logging in: ${err.message}`);
        }
    };

    return (
        <Form onSubmit={handleLogin}>
            {/* Success/Error Messages */}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control type="text" name="firstname" value={profileData.firstname} onChange={handleChange} />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control type="text" name="lastname" value={profileData.lastname} onChange={handleChange} />
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
            <Form.Group className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" value={profileData.username} onChange={handleChange} />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={profileData.password} onChange={handleChange} />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            {/* Button Connect to Google */}
            <Button variant="light" size='sm' className='ms-2'>
                <FcGoogle size={35} className='me-2' />
                Connect to Google
            </Button>

            {/* Container of button(Save) */}
            <div className='mt-3'>
                <Button type="submit" variant='primary' className='ms-2'>Login and Save Staff Data</Button>
            </div>
        </Form>
    );
}

export default ProfileComp;
