import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase"; // Import your Firebase config

const RequestResetCode = () => {
    const [username, setUsername] = useState(""); // Change to username
    const [message, setMessage] = useState("");

    const handleRequestResetCode = async () => {
        try {
            const functions = getFunctions(app);
            const sendResetCode = httpsCallable(functions, 'sendResetCode');
            const result = await sendResetCode({ username }); // Pass the username
            setMessage(result.data.message);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Request Password Reset Code</h2>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleRequestResetCode}>Send Reset Code</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RequestResetCode;
