import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

function SLoginCard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Attempting to log in with:", username, password);

        try {
            const staffCollection = collection(db, "staff");
            const staffQuery = query(staffCollection, where("username", "==", username));
            const staffSnapshot = await getDocs(staffQuery);

            console.log("Staff Snapshot:", staffSnapshot.docs); // Log the snapshot

            if (staffSnapshot.empty) {
                alert("Login failed. Username not found.");
                setLoading(false);
                return;
            }

            const userDoc = staffSnapshot.docs[0];
            const storedPassword = userDoc.data().password;

            if (storedPassword !== password) {
                alert("Login failed. Incorrect password.");
                setLoading(false);
                return;
            }

            console.log("User logged in successfully");
            localStorage.setItem('userId', userDoc.id);
            navigate("/SDashboard");

        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <Form onSubmit={handleLogin}>
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FloatingLabel>

                <Button
                    variant="primary"
                    style={{ width: "70%", marginTop: "20px" }}
                    type="submit"
                    size='lg'
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </Form>
        </>
    );
}

export default SLoginCard;
