import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ResetPassword = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');

    const validatePhoneNumber = (number) => {
        const regex = /^[+]?[0-9]{10,12}$/; // Adjust as needed for country-specific formats
        return regex.test(number);
    };

    const handleSendOtp = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            alert('Invalid phone number');
            return;
        }

        try {
            const response = await fetch('https://<your-firebase-functions-url>/sendOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber }),
            });

            const result = await response.json();
            if (response.ok) {
                setOtpSent(true);
                alert('OTP sent!');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('https://<your-firebase-functions-url>/verifyOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, phoneNumber }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('OTP verified successfully!');
                // Allow password reset after OTP is verified
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword) {
            setError('Password is required');
            return;
        }

        try {
            const response = await fetch('https://<your-backend-url>/resetPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, newPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Password reset successfully!');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <Form>
                <Form.Group className="mb-3" controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    onClick={handleSendOtp}
                    disabled={otpSent}
                >
                    Send OTP
                </Button>

                {otpSent && (
                    <>
                        <Form.Group className="mb-3" controlId="otp">
                            <Form.Label>Enter OTP</Form.Label>
                            <Form.Control
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            onClick={handleVerifyOtp}
                        >
                            Verify OTP
                        </Button>
                    </>
                )}

                {otpSent && (
                    <>
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            onClick={handleResetPassword}
                        >
                            Reset Password
                        </Button>
                    </>
                )}

                {error && <div className="error">{error}</div>}
            </Form>
        </div>
    );
};

export default ResetPassword;
