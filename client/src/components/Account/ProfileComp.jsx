// ProfileComp.jsx

import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase'; // Import Firebase configuration

const ProfileComp = () => {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState('');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);

    // Set persistence for authentication
    useEffect(() => {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                console.log("Persistence set to local");
            })
            .catch((error) => {
                console.error("Persistence error:", error);
            });
    }, [auth]);

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log("Current User in ProfileComp:", currentUser);
            setUser(currentUser);
            if (currentUser) {
                console.log("User is logged in");
                fetchUserData(currentUser.uid);
            } else {
                console.log("User is not logged in.");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    // Fetch user data from Firestore
    const fetchUserData = async (uid) => {
        setLoading(true);
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched User Data:", userData);
            setFirstname(userData.firstname || "");
            setLastname(userData.lastname || "");
            setGender(userData.gender || "");
            setUsername(userData.username || "");
        } else {
            console.log("User document does not exist.");
        }
        setLoading(false);
    };

    const handleGenderSelect = (eventKey) => {
        setGender(eventKey);
    };

    const handleSave = async () => {
        if (!user) {
            alert("User is not authenticated. Please log in to update your profile.");
            return;
        }

        try {
            const userDocRef = doc(db, "users", user.uid);

            // Update password if provided
            if (password) {
                // You may need to use re-authentication if updating the password
                await updatePassword(user, password);
            }

            // Update other details in Firestore
            await updateDoc(userDocRef, {
                firstname,
                lastname,
                gender,
                username,
            });

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile: " + error.message);
        }
    };

    // Render Profile Form
    return (
        <Form>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status" />
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : user ? (
                <>
                    <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                        <Col lg={6}>
                            <Form.Group className="mb-3" controlId="firstname">
                                <Form.Label>FIRST NAME</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group className="mb-3" controlId="lastname">
                                <Form.Label>LAST NAME</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Dropdown for Gender */}
                    <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "11px" }}>
                        <Form.Control
                            aria-label="Text input with dropdown button"
                            placeholder={gender || 'Select Gender'}
                            readOnly
                        />
                        <DropdownButton
                            variant="outline-secondary"
                            title="Gender"
                            id="input-group-dropdown-2"
                            align="end"
                            onSelect={handleGenderSelect}
                        >
                            <Dropdown.Item eventKey="Male">Male</Dropdown.Item>
                            <Dropdown.Item eventKey="Female">Female</Dropdown.Item>
                        </DropdownButton>
                    </InputGroup>

                    <Form.Group className="mb-3" controlId="username" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <div className='mt-3'>
                        <Button variant='primary' className='ms-2' onClick={handleSave}>Save</Button>
                    </div>
                </>
            ) : (
                <p>Please log in to view and edit your profile.</p>
            )}
        </Form>
    );
}

export default ProfileComp;
