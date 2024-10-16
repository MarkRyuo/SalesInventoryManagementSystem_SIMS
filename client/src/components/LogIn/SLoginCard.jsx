import { useState } from 'react';
import { Button, Form, FloatingLabel, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginStaff from '../../services/LoginStaff'; // Adjust the import path

function SLoginCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true); // Start loading

        try {
            await LoginStaff(username, password, navigate);
            setSuccessMessage('Login successful. Redirecting...');
            setLoading(false); // Stop loading

            // Optionally, you can set a delay before redirecting
            setTimeout(() => {
                navigate('/SDashboard'); // Adjust this route as needed
            }, 2000); // Redirect after 2 seconds
        } catch (error) {
            setErrorMessage(error.message);
            setLoading(false); // Stop loading
        }
    };

    return (
        <Form onSubmit={handleLogin}>
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

            {/* Display success or error messages */}
            {errorMessage && (
                <Alert variant="danger" className="mt-3">
                    {errorMessage}
                </Alert>
            )}
            {successMessage && (
                <Alert variant="success" className="mt-3">
                    {successMessage}
                </Alert>
            )}

            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                type='submit'
                size='lg'
                disabled={loading} // Disable button when loading
            >
                {loading ? (
                    <>
                        <Spinner animation="border" size="sm" role="status" className="me-2" />
                        Logging in...
                    </>
                ) : (
                    'Login'
                )}
            </Button>
        </Form>
    );
}

export default SLoginCard;
