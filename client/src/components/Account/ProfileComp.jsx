import { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../../services/firebase'; // Firebase config
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const ProfileComp = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const adminId = localStorage.getItem('adminId');

    useEffect(() => {
        // Fetch user data from Firestore based on adminId
        const fetchUserData = async () => {
            if (!adminId) {
                alert("No user ID found. Please log in.");
                navigate("/");
                return;
            }

            try {
                // You can add Firestore code to fetch user data here
            } catch (error) {
                console.error("Error fetching user data:", error.message);
                alert("Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, [adminId, navigate]);

    // Handle Google Sign-In for Admin
    const handleGoogleSignIn = async () => {
        try {
            // Use Firebase Auth to sign in with Google
            const result = await signInWithPopup(auth, googleProvider);

            // Get user info from Google
            const user = result.user;
            const { displayName, email, uid } = user;

            // Save or update user data in Firestore
            await setDoc(doc(db, "admins", uid), {
                firstname: displayName.split(" ")[0],
                lastname: displayName.split(" ")[1],
                email: email,
                username: email.split('@')[0], // Generate username from email
            });

            localStorage.setItem("adminId", uid);
            setUserData({
                firstname: displayName.split(" ")[0],
                lastname: displayName.split(" ")[1],
                email,
                username: email.split('@')[0],
            });

            alert("Successfully signed in with Google!");
            navigate("/DashboardPage");

        } catch (error) {
            console.error("Error during Google sign-in:", error.message);
            alert("Failed to sign in with Google.");
        }
    };

    return (
        <div>
            <Form>
                <Row>
                    <Col lg={6}>
                        <Form.Group className="mb-3" controlId="firstname">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={userData.firstname}
                                onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                                disabled={!isEditing}
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={6}>
                        <Form.Group className="mb-3" controlId="lastname">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={userData.lastname}
                                onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                                disabled={!isEditing}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col lg={6}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={userData.username}
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                disabled={!isEditing}
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={6}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                disabled={!isEditing}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {!isEditing && (
                    <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
                )}

                <Button variant="primary" onClick={handleGoogleSignIn}>
                    Sign in with Google
                </Button>

            </Form>
        </div>
    );
};

export default ProfileComp;
