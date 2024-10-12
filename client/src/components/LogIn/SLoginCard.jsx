import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form, Alert } from 'react-bootstrap'; //? Import Alert for error messages
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginStaff from '../../services/LoginStaff'; //? Import the LoginStaff service

//* Child
function SLoginCard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(""); //* State for username
    const [password, setPassword] = useState(""); //* State for password
    const [loading, setLoading] = useState(false); //* Loading state
    const [error, setError] = useState(""); //* State for error messages

    const handleLogin = async (e) => {
        e.preventDefault(); //? Prevent default form submission
        setLoading(true); //? Start loading
        setError(""); //? Reset error message
        console.log("Attempting to log in with:", username, password);

        try {
            //? Call LoginStaff with the provided username and password
            await LoginStaff(username, password, navigate); // Pass navigate as an argument
        } catch (err) {
            //? Set error message on failed login
            setError("Invalid username or password. Please try again.");
            console.error("Login failed:", err);
        } finally {
            setLoading(false); //? Stop loading after the login attempt
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </FloatingLabel>

                {/* Password */}
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FloatingLabel>

                {/* Error Message */}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>} {/* Show error message if exists */}

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
    );
}

export default SLoginCard;
