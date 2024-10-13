import { useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginStaff from '../../services/LoginStaff'; // Adjust the import path

function SLoginCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrorMessage(''); // Clear any previous error messages

        try {
            await LoginStaff(username, password, navigate); // Call the login function
        } catch (error) {
            setErrorMessage(error.message); // Display the error message
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
            {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
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
