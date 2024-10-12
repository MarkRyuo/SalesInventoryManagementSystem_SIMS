import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase'; // Import Firebase configuration
import { getDocs, collection, query, where } from "firebase/firestore";

export const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            // Query to find the user by username in Firestore
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            // Check if user with the given username exists
            if (querySnapshot.empty) {
                alert("Login failed. Username not found.");
                return;
            }

            // Extract the email from the user document
            // Authenticate using the found email and provided password
            navigate("/DashboardPage");
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <Form>
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>

            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                onClick={handleLogin}
                size='lg'
            >
                Login
            </Button>
        </Form>
    );
};
