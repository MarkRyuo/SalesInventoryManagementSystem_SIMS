import { useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginStaff from '../../services/LoginStaff'; // Adjust the import path

function SLoginCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrorMessage(''); // Clear any previous error messages
        setSuccessMessage(''); // Clear any previous success messages
        setLoading(true); // Set loading state

        try {
            await LoginStaff(username, password, navigate); // Call the login function
            setSuccessMessage("Login successful!"); // Set success message
        } catch (error) {
            setErrorMessage(error.message); // Display the error message
        } finally {
            setLoading(false); // Reset loading state
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

            {errorMessage && <div className="text-danger mb-3 error-animation">{errorMessage}</div>}
            {successMessage && <div className="text-success mb-3 success-animation">{successMessage}</div>}
            {loading && <div className="text-info mb-3">Loading...</div>}

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
                type='submit'
                size='lg'>
                Login
            </Button>
        </Form>
    );
}

export default SLoginCard;
