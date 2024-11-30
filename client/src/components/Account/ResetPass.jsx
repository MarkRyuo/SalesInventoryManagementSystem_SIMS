import { useState } from 'react';
import { Form, Button, Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase"; // Ensure this points to your Firebase config
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing
import ResetPassScss from './ResetPass.module.scss';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { IoArrowBack } from "react-icons/io5";
import { PiShieldWarningFill } from "react-icons/pi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons

const ResetPass = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false); // State for OTP verification
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading spinner
    const navigate = useNavigate(); // Initialize useNavigate

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const checkEmailExists = async () => {
        const adminsCollection = collection(db, 'admins');
        const q = query(adminsCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleSendOtp = async () => {
        if (!validateEmail(email)) {
            setError('Invalid email address');
            setShowErrorModal(true);
            return;
        }

        const emailExists = await checkEmailExists();
        if (!emailExists) {
            setError('Email not found');
            setShowErrorModal(true);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/salesinventorymanagement-1bb27/us-central1/api/generate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (response.ok) {
                setOtpSent(true);
                setSuccess('OTP sent successfully!');
                setShowSuccessModal(true);
                setLoading(false);
                setTimeout(() => setShowSuccessModal(false), 2000);
            } else {
                setError(result.error);
                setShowErrorModal(true);
                setLoading(false);
                setTimeout(() => setShowErrorModal(false), 2000);
            }
        } catch (error) {
            setError('Error sending OTP.');
            setShowErrorModal(true);
            setLoading(false);
            setTimeout(() => setShowErrorModal(false), 2000);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('http://localhost:5001/salesinventorymanagement-1bb27/us-central1/api/validate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, email }),
            });

            const result = await response.json();
            if (response.ok) {
                setSuccess('OTP verified successfully!');
                setShowSuccessModal(true);
                setOtpVerified(true);
                setTimeout(() => setShowSuccessModal(false), 2000);
            } else {
                setError(result.error);
                setShowErrorModal(true);
                setTimeout(() => setShowErrorModal(false), 2000);
            }
        } catch (error) {
            setError('Error verifying OTP.');
            setShowErrorModal(true);
            setTimeout(() => setShowErrorModal(false), 2000);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword) {
            setError('Password is required');
            setShowErrorModal(true);
            setTimeout(() => setShowErrorModal(false), 2000);
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const adminsCollection = collection(db, 'admins');
            const q = query(adminsCollection, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Email not found');
                setShowErrorModal(true);
                setTimeout(() => setShowErrorModal(false), 2000);
                return;
            }

            for (const doc of querySnapshot.docs) {
                const adminRef = doc.ref;
                await updateDoc(adminRef, { password: hashedPassword });
            }

            setSuccess('Password reset successfully!');
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 2000);

            setTimeout(() => {
                navigate('/LoginPage');
            }, 2000);
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Error resetting password.');
            setShowErrorModal(true);
            setTimeout(() => setShowErrorModal(false), 2000);
        }
    };

    return (
        <Container fluid style={{ background: "radial-gradient(500px at 0.7% 3.4%, rgb(164, 231, 192) 0%, rgb(245, 255, 244) 80%)" }}>
            <Row className={ResetPassScss.rowContainer}>
                <Col xs={12} md={8} lg={4} className={ResetPassScss.colContainer}>
                    <div><PiShieldWarningFill size={70} /></div>
                    <h2 className="mb-2 text-center">Forgot Password</h2>
                    <p className='fs-6 m-0 text-center w-65'>Enter your Email and we'll send you an OTP to reset your password.</p>

                    <Form>
                        {!otpSent && !otpVerified && (
                            <Form.Group controlId="email" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                        )}

                        {!otpSent && (
                            <Button variant="primary" onClick={handleSendOtp} className="w-100">
                                {loading ? <Spinner animation="grow" variant="light" size="sm" /> : 'Send OTP'}
                            </Button>
                        )}

                        {otpSent && !otpVerified && (
                            <>
                                <Form.Group controlId="otp" className="mb-3 mt-2">
                                    <Form.Label>Enter OTP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="0000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleVerifyOtp} className="w-100 mb-3">
                                    Verify OTP
                                </Button>
                            </>
                        )}

                        {otpSent && otpVerified && (
                            <>
                                <Form.Group controlId="newPassword" className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            type={passwordVisible ? 'text' : 'password'}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <span
                                            className="ms-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        >
                                            {passwordVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                        </span>
                                    </div>
                                </Form.Group>
                                <Button variant="success" onClick={handleResetPassword} className="w-100">
                                    Reset Password
                                </Button>
                            </>
                        )}
                    </Form>
                    <Link to={"/LoginPage"} className="mt-2 me-3" style={{ color: "#444444", fontSize: "1rem", textDecoration: 'none' }}>
                        <IoArrowBack /> Back to Login
                    </Link>
                </Col>
            </Row>

            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Header className='bg-danger'>
                    <Modal.Title className='text-light'>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{error}</Modal.Body>
            </Modal>

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header className='bg-success'>
                    <Modal.Title className='text-light'>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>{success}</Modal.Body>
            </Modal>
        </Container>
    );
};

export default ResetPass;
