import { useState } from 'react';
import axios from 'axios';

function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('adminId');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/api/reset-password', { email, token, newPassword });
            alert('Password reset successfully!');
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPasswordPage;
