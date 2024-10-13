import { useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [customAnswer, setCustomAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    const handleVerification = async () => {
        try {
            const adminsCollection = collection(db, 'admins');
            const q = query(adminsCollection, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('Username not found.');
                return;
            }

            const adminDoc = querySnapshot.docs[0];
            const storedAnswer = adminDoc.data().customAnswer; // Assuming you have a field for the answer

            if (storedAnswer !== customAnswer) {
                alert('Incorrect answer to the security question.');
                return;
            }

            setIsVerified(true);
            alert('Verification successful. You can now reset your password.');

        } catch (error) {
            console.error('Verification error:', error.message);
            alert('An error occurred during verification. Please try again.');
        }
    };

    const handlePasswordReset = async () => {
        try {
            const adminsCollection = collection(db, 'admins');
            const q = query(adminsCollection, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('Username not found.');
                return;
            }

            const adminDoc = querySnapshot.docs[0];
            await adminDoc.ref.update({ password: newPassword });
            alert('Password reset successfully. Please login with your new password.');
            navigate('/login');
        } catch (error) {
            console.error('Password reset error:', error.message);
            alert('An error occurred while resetting your password. Please try again.');
        }
    };

    return (
        <Form>
            <h1>Forgot Password</h1>

            <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FloatingLabel>

            <FloatingLabel controlId="floatingAnswer" label="What is your pet's name?" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Answer to security question"
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                />
            </FloatingLabel>

            {isVerified && (
                <FloatingLabel controlId="floatingNewPassword" label="New Password" className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </FloatingLabel>
            )}

            {!isVerified ? (
                <Button variant="primary" onClick={handleVerification}>
                    Verify
                </Button>
            ) : (
                <Button variant="primary" onClick={handlePasswordReset}>
                    Reset Password
                </Button>
            )}
        </Form>
    );
};

export default ForgotPassword;
