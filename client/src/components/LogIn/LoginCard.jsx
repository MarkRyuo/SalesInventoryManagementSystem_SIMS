import React, { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Import the auth instance
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from '../../firebase'; // Import Firestore database
import { ref, get } from 'firebase/database'; // Import necessary functions from Firebase

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

        // Construct email from username
        const email = `${username}@example.com`; // Ensure this matches your user creation pattern

        console.log("Attempting to log in with email:", email); // Log the email for debugging

        try {
            // Attempt to sign in the user with Firebase Authentication
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/DashboardPage"); // Navigate to the dashboard on successful login
        } catch (err) {
            // Handle invalid credentials or wrong username/password
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError("Username or password is incorrect."); // Display general error for wrong credentials
            } else if (err.code === 'auth/invalid-email') {
                setError("The email address is not valid. Please check the username."); // Specific error for invalid email
            } else {
                setError("An error occurred. Please try again.");
                console.error("Login error:", err); // Log the error for debugging
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
