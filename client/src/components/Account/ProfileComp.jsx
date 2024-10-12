import { Row, Form, Col, Button, FloatingLabel } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getAuth, updateEmail } from "firebase/auth";
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

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid); // Use the user's UID
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setFirstname(userData.firstname);
                    setLastname(userData.lastname);
                    setGender(userData.gender);
                    setEmail(userData.email);
                    setUsername(userData.username);
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchUserData();
    }, [auth]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            const userRef = doc(db, "users", auth.currentUser.uid); // Use the user's UID
            await updateDoc(userRef, {
                firstname,
                lastname,
                gender,
                email,
                username,
            });

            // Optionally, update the Firebase Authentication email
            await updateEmail(auth.currentUser, email); // Only if the email has changed
            alert("Profile updated successfully.");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <Form onSubmit={handleUpdateProfile}>
            <Row>
                <Col>
                    <FloatingLabel controlId="floatingFirstname" label="Firstname">
                        <Form.Control
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="floatingLastname" label="Lastname">
                        <Form.Control
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            <FloatingLabel controlId="floatingGender" label="Gender" className="mb-3">
                <Form.Control
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                />
            </FloatingLabel>

            <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FloatingLabel>

            <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FloatingLabel>

            <Button variant="primary" type="submit">Update Profile</Button>
        </Form>
    );
};

export default ProfileComp;
