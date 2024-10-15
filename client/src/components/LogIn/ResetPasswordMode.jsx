import { useState } from 'react';
import { Form, FloatingLabel, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//? Icon
import { FaUnlock } from 'react-icons/fa';
//? Services
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
//? Css
import ResetModecss from './CSS/ResetMode.module.css';

function ResetPasswordMode() {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const adminDocId = localStorage.getItem('adminDocId');
    const navigate = useNavigate();

    const handlePasswordReset = async () => {
        try {
            if (!adminDocId) {
                setError('No admin document found.');
                return;
            }

            const adminDocRef = doc(db, 'admins', adminDocId);
            await updateDoc(adminDocRef, { password: newPassword });
            alert('Password reset successfully. Please login with your new password.');
            localStorage.removeItem('adminDocId');
            navigate('/');
        } catch (error) {
            console.error('Password reset error:', error);
            setError(`An error occurred: ${error.message}`);
        }
    };

    return (
        <Container fluid='lg' className={ResetModecss.containerMode}>
            <div className={ResetModecss.containerContent}>
                <div>
                    <span><FaUnlock size={20} /></span>
                    <p className="fs-4">Reset Password</p>
                    <p>Text Here</p>
                </div>
                <div>
                    <FloatingLabel controlId="floatingNewPassword" label="New Password" className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </FloatingLabel>
                    <Button variant="primary" onClick={handlePasswordReset}>
                        Reset Password
                    </Button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
            </div>
        </Container>
    );
}

export default ResetPasswordMode;
