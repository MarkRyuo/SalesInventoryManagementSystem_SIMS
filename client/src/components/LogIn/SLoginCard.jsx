import React, { useState } from 'react';
import { Button, Form, FloatingLabel, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Import the auth instance
import { signInAnonymously } from "firebase/auth"; // For anonymous authentication
import { db } from '../../firebase'; // Import Realtime Database
import { ref, get } from 'firebase/database'; // For querying staff

//* Child
function SLoginCard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Reset error state

        // Basic validation
        if (!username || !password) {
            setError("Please enter both username and password.");
            return;
        }

        try {
            // Sign in anonymously with Firebase Authentication
            const userCredential = await signInAnonymously(auth);
            console.log("Anonymous user signed in:", userCredential.user.uid);

            // Query the Realtime Database for the staff credentials
            const staffRef = ref(db, `staff/${username}`);
            const snapshot = await get(staffRef);

            if (snapshot.exists()) {
                const staffData = snapshot.val();
                // Validate password
                if (staffData.password === password) {
                    console.log("Login successful for staff:", username);
                    navigate("/SDashboard"); // Navigate to the staff dashboard
                } else {
                    setError("Username or password is incorrect.");
                }
            } else {
                setError("Username not found.");
            }
        } catch (err) {
            // Handle errors related to anonymous authentication
            setError("An error occurred. Please try again.");
            console.error("Login error:", err);
        }
    };

    return (
        <>
            <Form onSubmit={handleLogin}>
                {/* Display error message if there's an error */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Username Input */}
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FloatingLabel>

                {/* Password Input */}
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FloatingLabel>

                {/* Button for Login */}
                <Button
                    variant="primary"
                    style={{ width: "70%", marginTop: "20px" }}
                    type="submit"
                    size='lg'>
                    Login
                </Button>
            </Form>
        </>
    );
}

export default SLoginCard;
