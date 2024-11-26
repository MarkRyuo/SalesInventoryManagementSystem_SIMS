import { useState } from 'react';
import { Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import unifiedLogin from '../../../services/UnifiedLogIn'; // The combined login function
import LogInCardPagecss from './LandingPageCards.module.scss';
import { FaRegEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";

function LogInCardPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            await unifiedLogin(username, password, navigate);
        } catch (err) {
            setError(err.message); // Display error message
        }
    };

    return (
        <div className={LogInCardPagecss.LogInContainer}>
            <div className={LogInCardPagecss.LoginText}>
                <h1>Manage your entire Inventory in a single System</h1>
            </div>

            <div className={LogInCardPagecss.LoginFormContainer}>
                <div className={LogInCardPagecss.LoginForm}>
                    <form onSubmit={handleLogin}>
                        <h2>Welcome</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div>
                            <p className='mb-2'>Username*</p>
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
                                    {isPasswordVisible ? <FaRegEye size={20}/> : <FaEyeSlash size={20}/>}
                                </span>
                            </div>
                        </div>
                        <Button variant='' type='submit' onSubmit={handleLogin} className={LogInCardPagecss.LoginButton}>
                            Login
                        </Button>
                    </form>

                    <a href="#">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
}

export default LogInCardPage;
