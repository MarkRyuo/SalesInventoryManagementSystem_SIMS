import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import unifiedLogin from '../../../services/UnifiedLogIn'; // Unified login function
import LogInCardPagecss from './LandingPageCards.module.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LogInCardPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleEmailPasswordLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await unifiedLogin(username, password, navigate);
            alert('Login successful!');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={LogInCardPagecss.LogInContainer}>
            <div className={LogInCardPagecss.LoginText}>
                <h1>Manage your entire Inventory in a single System</h1>
            </div>
            <div className={LogInCardPagecss.LoginFormContainer}>
                <div className={LogInCardPagecss.LoginForm}>
                    <h2>Welcome</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleEmailPasswordLogin}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username/Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your username or email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <div style={{ position: 'relative' }}>
                                <Form.Control
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LogInCardPage;
