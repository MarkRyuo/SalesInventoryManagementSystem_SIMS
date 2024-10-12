// src/components/LoginCard.js

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

export const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            // Access the users collection
            const usersCollection = collection(db, "users");

            // Create a query to find the user by username
            const q = query(usersCollection, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            // Check if the user exists
            if (querySnapshot.empty) {
                alert("Login failed. Username not found.");
                return;
            }

            // Get the first matching user document
            const userDoc = querySnapshot.docs[0];
            const storedPassword = userDoc.data().password;

            // Check if the password matches
            if (storedPassword !== password) {
                alert("Login failed. Incorrect password.");
                return;
            }

            // Successful login
            console.log("User logged in successfully");
            navigate("/DashboardPage"); // Navigate to dashboard or profile
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <Form>
            {/* Username Field */}
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FloatingLabel>

            {/* Password Field */}
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>

            {/* Login Button */}
            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                onClick={handleLogin}
                size='lg'>
                Login
            </Button>
        </Form>
    );
};
