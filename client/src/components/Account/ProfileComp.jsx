import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getAuth, updateEmail, updatePassword, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase'; // Import Firebase configuration

const ProfileComp = () => {
    const auth = getAuth(); // Get the Auth instance
    const [user, setUser] = useState(null); // State for user
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            console.log("Current User:", currentUser); // Debugging line
            setUser(currentUser); // Set user state when authentication state changes
            if (currentUser) {
                setEmail(currentUser.email || ""); // Default to user's email
                fetchUserData(currentUser.uid); // Fetch user data
            } else {
                console.log("User is not logged in.");
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, [auth]);

    // Fetch user data from Firestore
    const fetchUserData = async (uid) => {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            // Set state with fetched data
            setFirstname(userData.firstname || "");
            setLastname(userData.lastname || "");
            setGender(userData.gender || "");
            setUsername(userData.username || "");
        } else {
            console.log("User document does not exist.");
        }
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

            // Update email in Firebase Auth and Firestore
            if (email !== user.email) {
                await updateEmail(user, email);
                await updateDoc(userDocRef, { email });
            }

            // Update password if provided
            if (password) {
                await updatePassword(user, password);
                // Optionally, avoid storing passwords in Firestore for security reasons
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

    const handleEmailVerification = async () => {
        if (user && !user.emailVerified) {
            await sendEmailVerification(user);
            alert("Verification email sent. Please check your inbox.");
        }
    };

    // Render Profile Form
    return (
        <Form>
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

            <Form.Group className="mb-3" controlId="email" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <div className='mt-3'>
                <Button variant='primary' className='ms-2' onClick={handleSave}>Save</Button>
            </div>
        </Form>
    );
}

export default ProfileComp;
