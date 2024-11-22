import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordComp = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = async () => {
        const token = new URLSearchParams(window.location.search).get('token');
        try {
            await axios.post('/api/reset-password', { token, newPassword: password });
            alert("Password reset successfully.");
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.error || "Failed to reset password.");
        }
    };

    return (
        <div>
            <h3>Reset Password</h3>
            <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleReset}>Reset</button>
        </div>
    );
};

export default ResetPasswordComp;
