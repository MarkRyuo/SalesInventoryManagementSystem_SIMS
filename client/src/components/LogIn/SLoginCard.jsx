import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

//* Child
function SLoginCard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(""); // State for username
    const [password, setPassword] = useState(""); // State for password
    const [loading, setLoading] = useState(false); // Loading state

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Start loading

        try {
            // Access the users collection
            const usersCollection = collection(db, "users");

            // Create a query to find the user by username
            const q = query(usersCollection, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            // Check if the user exists
            if (querySnapshot.empty) {
                alert("Login failed. Username not found.");
                setLoading(false); // Stop loading
                return;
            }

            // Get the first matching user document
            const userDoc = querySnapshot.docs[0];
            const storedPassword = userDoc.data().password;

            // Check if the password matches
            if (storedPassword !== password) {
                alert("Login failed. Incorrect password.");
                setLoading(false); // Stop loading
                return;
            }

            // Successful login
            console.log("User logged in successfully");
            localStorage.setItem('userId', userDoc.id); // Store user ID
            navigate("/SDashboard"); // Navigate to dashboard or profile
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed. Please try again.");
            setLoading(false); // Stop loading
        }
    };

    return (
        <>
            <Form onSubmit={handleLogin}>
                {/* Username */}
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder='Username'
                        value={username} // Bind value to state
                        onChange={(e) => setUsername(e.target.value)} // Update username state
                        required
                    />
                </FloatingLabel>

                {/* Password */}
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password} // Bind value to state
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        required
                    />
                </FloatingLabel>

                {/* Button of Login */}
                <Button
                    variant="primary"
                    style={{ width: "70%", marginTop: "20px" }}
                    type="submit" // Change to submit type for form submission
                    size='lg'
                    disabled={loading} // Disable button while loading
                >
                    {loading ? 'Logging in...' : 'Login'} {/* Show loading text */}
                </Button>
            </Form>
        </>
    )
}

export default SLoginCard;
