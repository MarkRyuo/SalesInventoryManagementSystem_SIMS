import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { getDocs, collection, query, where } from "firebase/firestore";
import { sha256 } from 'crypto-hash'; // Ensure to install this package

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
            const storedPasswordHash = userDoc.data().password; // This should be a hash

            // Hash the entered password and compare
            const hashedPassword = await sha256(password);

            // Check if the hashed password matches
            if (storedPasswordHash !== hashedPassword) {
                alert("Login failed. Incorrect password.");
                return;
            }

            // Successful login
            navigate("/DashboardPage");
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
