import React, { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Import the auth instance
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from '../../firebase'; // Import Firestore database
import { getDatabase, ref, get } from 'firebase/database'; // Import necessary functions from Firebase

export const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(''); // State for username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        setError(''); // Reset error state before login attempt

        // Basic validation
        if (!username || !password) {
            setError("Please enter both username and password.");
            return;
        }

        try {
            // Fetch the email associated with the username from Firestore
            const dbRef = ref(db, 'staff'); // Reference to the 'staff' node
            const snapshot = await get(dbRef);

            let userEmail = null;

            // Loop through the staff data to find the matching username
            snapshot.forEach((childSnapshot) => {
                const staffData = childSnapshot.val();
                if (staffData.username === username) {
                    userEmail = staffData.email; // Get the email associated with the username
                }
            });

            // If no email was found for the username
            if (!userEmail) {
                setError("Username not found.");
                return;
            }

            // Attempt to sign in the user with Firebase Authentication using the retrieved email
            await signInWithEmailAndPassword(auth, userEmail, password);
            navigate("/DashboardPage"); // Navigate to the dashboard on successful login
        } catch (err) {
            // Handle errors (e.g., incorrect password, user not found, invalid credentials)
            if (err.code === 'auth/wrong-password') {
                setError("Incorrect password.");
            } else if (err.code === 'auth/user-not-found') {
                setError("User not found.");
            } else {
                setError(err.message); // For other errors, show the original error message
            }
        }
    };

    return (
        <Form onSubmit={handleLogin}>
            {/* Display error message if there's an error */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Username Input */}
            <FloatingLabel controlId="floatingUsername" label="Username" className="mb-4">
                <Form.Control 
                    type="text" 
                    placeholder='Username'
                    value={username} // Bind input value to state
                    onChange={(e) => setUsername(e.target.value)} // Update state on change
                />
            </FloatingLabel>

            {/* Password Input */}
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password} // Bind input value to state
                    onChange={(e) => setPassword(e.target.value)} // Update state on change
                />
            </FloatingLabel>

            {/* Button of Login */}
            <Button 
                variant="primary" 
                style={{width: "70%", marginTop: "20px"}} 
                type="submit" // Change to type submit for form submission
                size='lg'>
                Login
            </Button>
        </Form>
    );
};
