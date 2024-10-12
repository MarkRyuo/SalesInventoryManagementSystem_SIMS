import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { getAuth, updateEmail, updatePassword, sendEmailVerification } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from '../../firebase'; // Import Firebase configuration

const ProfileComp = () => {
    const user = auth.currentUser;

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState(user?.email || "");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleGenderSelect = (eventKey) => {
        setGender(eventKey);
    };

    const handleSave = async () => {
        try {
            // Update email in Firebase Auth and Firestore
            if (email !== user.email) {
                await updateEmail(user, email);
                await updateDoc(doc(db, "users", user.uid), { email });
            }

            // Update password if provided
            if (password) {
                await updatePassword(user, password);
                await updateDoc(doc(db, "users", user.uid), { password });
            }

            // Update other details in Firestore
            await updateDoc(doc(db, "users", user.uid), {
                firstname,
                lastname,
                gender,
                username,
            });

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleEmailVerification = async () => {
        if (user && !user.emailVerified) {
            await sendEmailVerification(user);
            alert("Verification email sent. Please check your inbox.");
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
                    title="Dropdown"
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

            <Button variant="light" size='sm' className='ms-2' onClick={handleEmailVerification}>
                Connect to Email
            </Button>

            <div className='mt-3'>
                <Button variant='primary' className='ms-2' onClick={handleSave}>Save</Button>
            </div>
        </Form>
    );
}

export default ProfileComp;
