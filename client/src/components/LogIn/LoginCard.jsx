import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

export const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            // Step 1: Find user by username in Firestore
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            // Step 2: Check if the user exists
            if (querySnapshot.empty) {
                alert("Login failed. Username not found.");
                return;
            }

            // Step 3: Verify password directly (ensure your Firestore rules allow this)
            const userDoc = querySnapshot.docs[0];
            const storedPassword = userDoc.data().password;

            if (storedPassword !== password) {
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
            {/* Username */}
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FloatingLabel>

            {/* Password */}
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
