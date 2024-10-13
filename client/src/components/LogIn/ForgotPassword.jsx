import { useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [customQuestions, setCustomQuestions] = useState([]);
    const [customAnswers, setCustomAnswers] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [adminDoc, setAdminDoc] = useState(null); // State to hold admin document data
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

            const adminDocument = querySnapshot.docs[0];
            const recoveryQuestions = adminDocument.data().recoveryQuestions || [];

            // Ensure we have at least 3 questions to display
            if (recoveryQuestions.length < 3) {
                alert('Not enough recovery questions set.');
                return;
            }

            // Randomly select 2 questions from the 3 available
            const selectedQuestions = recoveryQuestions.sort(() => 0.5 - Math.random()).slice(0, 2);
            setCustomQuestions(selectedQuestions);

            // Store the admin document in state for later use
            setAdminDoc(adminDocument);

            // Reset the answer state for new questions
            setCustomAnswers({});
            setIsVerified(false); // Reset verification state
        } catch (error) {
            console.error('Verification error:', error.message);
            alert('An error occurred during verification. Please try again.');
        }
    };

    const handleAnswerChange = (question, answer) => {
        setCustomAnswers((prev) => ({
            ...prev,
            [question]: answer,
        }));
    };

    const checkAnswersAndReset = () => {
        if (!adminDoc) return; // Ensure adminDoc is available

        const answers = adminDoc.data().answers || {};
        let correctCount = 0;

        customQuestions.forEach((question) => {
            if (customAnswers[question] === answers[question]) {
                correctCount++;
            }
        });

        if (correctCount >= 2) {
            setIsVerified(true);
            alert('Verification successful. You can now reset your password.');
        } else {
            alert('Incorrect answers to the security questions. Please try again.');
        }
    };

    const handlePasswordReset = async () => {
        try {
            if (!adminDoc) return; // Ensure adminDoc is available
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

            {/* Verify Username Button */}
            {!isVerified && (
                <Button variant="primary" onClick={handleVerification} className="mb-3">
                    Verify Username
                </Button>
            )}

            {/* Display security questions only if username is verified */}
            {customQuestions.map((question, index) => (
                <FloatingLabel key={index} controlId={`floatingAnswer${index}`} label={question} className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Answer to security question"
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                    />
                </FloatingLabel>
            ))}

            {isVerified && (
                <>
                    <FloatingLabel controlId="floatingNewPassword" label="New Password" className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </FloatingLabel>

                    {/* Show Reset Password Button only if verified */}
                    <Button variant="primary" onClick={handlePasswordReset}>
                        Reset Password
                    </Button>
                </>
            )}

            {/* Show Verify Answers Button only if username is verified */}
            {isVerified ? (
                <Button variant="primary" onClick={checkAnswersAndReset}>
                    Verify Answers
                </Button>
            ) : null}
        </Form>
    );
};

export default ForgotPassword;
