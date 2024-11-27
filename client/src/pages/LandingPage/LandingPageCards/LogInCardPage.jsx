import { useState } from 'react';
import { Button, Modal, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import unifiedLogin from '../../../services/UnifiedLogIn'; // The combined login function
import { FaRegEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import LoginPageCardScss from './SCSS/LoginPageCard.module.scss';

function LogInCardPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setFadeOut(false); // Reset fade-out effect

        try {
            await unifiedLogin(username, password, navigate);
            setShowSuccessModal(true); // Show success modal
        } catch (err) {
            setError(err.message); // Display error message
            setTimeout(() => setFadeOut(true), 1500); // Trigger fade-out after 1.5s
            setTimeout(() => setError(""), 2000); // Clear error after 2s
        }
    };

    return (
        <div className={LoginPageCardScss.LogInContainer}>
            <div className={LoginPageCardScss.LoginText}>
                <h1>Manage your entire Inventory in a single System</h1>
            </div>

            <div className={LoginPageCardScss.LoginFormContainer}>
                <form onSubmit={handleLogin}>
                    <h2>Welcome</h2>
                    {error && (
                        <Alert
                            variant="danger"
                            className={`${fadeOut ? LoginPageCardScss.fadeOut : ""}`}
                        >
                            {error}
                        </Alert>
                    )}
                    <div>
                        <p className='m-0'>Username*</p>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <p className='m-0'>Password*</p>
                        <div style={{ position: 'relative' }}>
                            <input
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
                                    right: '40px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                }}
                            >
                                {isPasswordVisible ? <FaRegEye size={20} /> : <FaEyeSlash size={20} />}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant=''
                        type='submit'
                        onSubmit={handleLogin}
                        className={LoginPageCardScss.LoginButton}
                    >
                        Login
                    </Button>
                    <Link to={"/ResetPass"}>Forgot Password?</Link>
                </form>
            </div>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Welcome back! You are now logged in.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LogInCardPage;
