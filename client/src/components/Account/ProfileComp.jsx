import { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../../services/firebase'; // Firebase config
import { signInWithPopup, updatePassword } from 'firebase/auth'; // Import updatePassword
import { doc, getDoc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs'; // Import bcryptjs

const ProfileComp = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "", // Add password to state
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
                // Get user data from Firestore (admins collection)
                const docRef = doc(db, "admins", adminId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const user = docSnap.data();
                    setUserData({
                        firstname: user.firstname || '',
                        lastname: user.lastname || '',
                        email: user.email || '',
                        username: user.username || '',
                        password: '', // Initialize password as empty string
                    });
                } else {
                    console.log("No user data found!");
                }
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
            // If the admin is already signed in, don't trigger a new sign-in
            if (adminId) {
                alert("You are already signed in.");
                return;
            }

            // Sign in with Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const { displayName, email, uid } = user;

            // Check if the signed-in user matches the adminId
            if (uid === adminId) {
                // User exists in Firestore, update the user data
                const docRef = doc(db, "admins", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Update the user data
                    await setDoc(docRef, {
                        firstname: displayName.split(" ")[0],
                        lastname: displayName.split(" ")[1] || '',
                        email: email,
                        username: email.split('@')[0], // Generate username from email
                    }, { merge: true });
                }

                // Save user data to state and localStorage
                setUserData({
                    firstname: displayName.split(" ")[0],
                    lastname: displayName.split(" ")[1] || '',
                    email,
                    username: email.split('@')[0],
                    password: '', // Reset password field
                });

                alert("Successfully signed in with Google!");
                navigate("/DashboardPage");
            } else {
                // If the UID doesn't match the adminId, show an error or prompt user to log in first
                alert("This Google account does not match the existing admin account.");
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error.message);
            alert("Failed to sign in with Google.");
        }
    };


    // Handle updating user data
    const handleSaveChanges = async () => {
        try {
            // If password is set, hash it before saving
            let hashedPassword = userData.password;
            if (userData.password) {
                // Hash password using bcrypt
                hashedPassword = await bcrypt.hash(userData.password, 10);
            }

            // Save other updated data to Firestore
            await setDoc(doc(db, "admins", adminId), {
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                username: userData.username,
                password: hashedPassword, // Save hashed password in Firestore
            });

            // If password was updated, update it in Firebase Auth as well
            if (userData.password) {
                const user = auth.currentUser;
                if (user) {
                    await updatePassword(user, userData.password); // Update password in Firebase Auth
                    alert("Password updated successfully!");
                }
            }

            setIsEditing(false);
            alert("User data updated successfully!");
        } catch (error) {
            console.error("Error saving data:", error.message);
            alert("Failed to update user data.");
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

                {/* Password Field */}
                {isEditing && (
                    <Row>
                        <Col lg={6}>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    placeholder="Enter new password"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}

                {!isEditing ? (
                    <>
                        <Button variant="primary" onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>
                        <Button variant="secondary" onClick={handleGoogleSignIn}>
                            Connect To Google
                        </Button>
                    </>
                ) : (
                    <Button variant="success" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                )}
            </Form>
        </div>
    );
};

export default ProfileComp;
