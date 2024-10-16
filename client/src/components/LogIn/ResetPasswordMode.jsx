import { useState } from 'react';
import { Form, FloatingLabel, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//? Icon
import { FaUnlock } from 'react-icons/fa';
//? Services
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
//? Css
import ResetModecss from './CSS/ResetMode.module.css';
//? Components
import ResetRendering from './ResetRendering';

function ResetPasswordMode() {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [show, setShow] = useState(false);
    const [alertOpacity, setAlertOpacity] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // State for managing loading screen
    const adminDocId = localStorage.getItem('adminDocId');
    const navigate = useNavigate();

    const handlePasswordReset = async () => {
        setError('');
        setSuccess('');
        setAlertOpacity(1);

        const lengthRequirement = newPassword.length >= 8;
        const uppercaseRequirement = /[A-Z]/.test(newPassword);
        const lowercaseRequirement = /[a-z]/.test(newPassword);
        const numberRequirement = /\d/.test(newPassword);
        const specialCharRequirement = /[!@#$%^&*]/.test(newPassword);

        if (!lengthRequirement || !uppercaseRequirement || !lowercaseRequirement || !numberRequirement || !specialCharRequirement) {
            setError('Password does not meet the required criteria.');
            setShow(true);
            setTimeout(() => {
                setAlertOpacity(0);
                setTimeout(() => {
                    setShow(false);
                }, 500);
            }, 2000);
            return;
        }

        try {
            if (!adminDocId) {
                setError('No admin document found.');
                setShow(true);
                setTimeout(() => {
                    setAlertOpacity(0);
                    setTimeout(() => {
                        setShow(false);
                    }, 500);
                }, 2000);
                return;
            }

            const adminDocRef = doc(db, 'admins', adminDocId);
            await updateDoc(adminDocRef, { password: newPassword });

            setSuccess('Password reset successfully.');
            setShow(true);
            setIsLoading(true); // Show loading screen for 5 seconds

            setTimeout(() => {
                setIsLoading(false); // Hide loading screen
                localStorage.removeItem('adminDocId');
                navigate('/');
            }, 5000); // 5 seconds delay before navigating
        } catch (error) {
            console.error('Password reset error:', error);
            setError(`An error occurred: ${error.message}`);
            setShow(true);
            setTimeout(() => {
                setAlertOpacity(0);
                setTimeout(() => {
                    setShow(false);
                }, 500);
            }, 2000);
        }
    };

    const passwordRequirements = () => {
        const lengthRequirement = newPassword.length >= 8;
        const uppercaseRequirement = /[A-Z]/.test(newPassword);
        const lowercaseRequirement = /[a-z]/.test(newPassword);
        const numberRequirement = /\d/.test(newPassword);
        const specialCharRequirement = /[!@#$%^&*]/.test(newPassword);

        return (
            <>
                <p className={lengthRequirement ? 'text-success' : 'text-danger'}>
                    {lengthRequirement ? '✓ At least 8 characters' : '✗ At least 8 characters'}
                </p>
                <p className={uppercaseRequirement ? 'text-success' : 'text-danger'}>
                    {uppercaseRequirement ? '✓ At least one uppercase letter' : '✗ At least one uppercase letter'}
                </p>
                <p className={lowercaseRequirement ? 'text-success' : 'text-danger'}>
                    {lowercaseRequirement ? '✓ At least one lowercase letter' : '✗ At least one lowercase letter'}
                </p>
                <p className={numberRequirement ? 'text-success' : 'text-danger'}>
                    {numberRequirement ? '✓ At least one number' : '✗ At least one number'}
                </p>
                <p className={specialCharRequirement ? 'text-success' : 'text-danger'}>
                    {specialCharRequirement ? '✓ At least one special character (e.g., !@#$%^&*)' : '✗ At least one special character (e.g., !@#$%^&*)'}
                </p>
            </>
        );
    };

    // If loading, display the ResetRendering component
    if (isLoading) {
        return <ResetRendering />;
    }

    return (
        <Container fluid='lg' className={ResetModecss.containerMode}>
            <div className={ResetModecss.containerContent}>
                <div>
                    <span><FaUnlock size={20} /></span>
                    <p className="fs-4">Reset Password</p>
                    <p>Please enter your new password below.</p>
                </div>
                <div>
                    {show && (
                        <Alert
                            variant={error ? 'danger' : 'success'}
                            onClose={() => setShow(false)}
                            dismissible={!!error}
                            style={{
                                opacity: alertOpacity,
                                transition: 'opacity 0.5s ease-in',
                                position: 'relative'
                            }}
                        >
                            <Alert.Heading>{error ? 'Error!' : 'Success!'}</Alert.Heading>
                            <p>{error || success}</p>
                            {!error && <hr />}
                        </Alert>
                    )}

                    <FloatingLabel controlId="floatingNewPassword" label="New Password" className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </FloatingLabel>
                    <div className="mb-3">
                        <h6>Password Requirements:</h6>
                        {passwordRequirements()}
                    </div>
                    <div className="d-flex justify-content-center w-100">
                        <Button variant="primary" onClick={handlePasswordReset} className="w-100">
                            Reset Password
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default ResetPasswordMode;
