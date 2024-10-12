import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase'; // Ensure you import auth from your firebase config
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ProfileComp = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        gender: "",
        username: "",
        password: "",
        email: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const userId = localStorage.getItem('userId'); // Assume this was saved during login

    // Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setUserData({ ...userData, gender: eventKey });
    };

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // Function to fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                alert("No user ID found. Please log in.");
                navigate("/");
                return;
            }

            try {
                const userDocRef = doc(db, 'admin', userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                    console.log("Fetched user data:", userDoc.data()); // Log fetched data
                } else {
                    alert("User data not found.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
                alert("Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    // Function to save updated user data
    const handleSave = async () => {
        try {
            console.log("Updating user data:", userData); // Log user data
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, userData);
            alert("Profile updated successfully.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error); // Full error log
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    // Function to handle Google Sign-In
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userRef = doc(db, 'users', userId); // Get the reference to the user's document based on the stored userId

            // Fetch existing user data
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                // User already exists, update their Firestore document with Google info
                await updateDoc(userRef, {
                    email: user.email,
                    // Optionally retain or update other fields if needed
                    // firstname: user.displayName.split(' ')[0] || "",
                    // lastname: user.displayName.split(' ')[1] || "",
                });
                alert("Profile connected to Google account.");
            } else {
                alert("User not found. Please log in first.");
                navigate("/login");
                return;
            }

            console.log("Google Sign-In successful:", user);
            // Update the local state with the user's info
            setUserData({
                ...userData, // Retain existing user data
                email: user.email,
                // Optional: You can update other fields as well
            });

        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            alert(`Failed to connect to Google: ${error.message}`);
        }
    };

    return (
        <Form>
            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="firstname">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={userData.firstname}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="lastname">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={userData.lastname}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </Form.Group>
                </Col>
            </Row>
            {/* DropDown (Male or Female) */}
            <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "11px" }}>
                <Form.Control
                    aria-label="Text input with dropdown button"
                    placeholder={userData.gender || 'Select Gender'}
                    readOnly
                    value={userData.gender}
                    disabled={!isEditing}
                />
                <DropdownButton
                    variant="outline-secondary"
                    title="Dropdown"
                    id="input-group-dropdown-2"
                    align="end"
                    onSelect={handleGenderSelect}
                    disabled={!isEditing}
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
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    disabled
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
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </Form.Group>

            {/* Email */}
            <Form.Group
                className="mb-3"
                controlId="email"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </Form.Group>

            {/* Button Connect to Google */}
            <Button variant="light" size='sm' className='ms-2' onClick={handleGoogleSignIn}>
                <FcGoogle size={35} className='me-2' />
                Connect to Google
            </Button>

            {/* Container of button (Save, Edit) */}
            <div className='mt-3'>
                <Button
                    variant='primary'
                    className='ms-2'
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}>
                    Edit
                </Button>
                <Button
                    variant='primary'
                    className='ms-2'
                    onClick={handleSave}
                    disabled={!isEditing}>
                    Save
                </Button>
            </div>
        </Form>
    );
}

export default ProfileComp;
