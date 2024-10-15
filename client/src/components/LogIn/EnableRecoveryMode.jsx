import { useState, useEffect } from 'react';
import { Form, FloatingLabel, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//? Icon
import { FaLock } from 'react-icons/fa';
//? Services
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
//? Css
import ResetModecss from './CSS/ResetMode.module.css';

function EnableRecoveryMode() {
    const [customQuestions, setCustomQuestions] = useState([]);
    const [customAnswers, setCustomAnswers] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const adminDocId = localStorage.getItem('adminDocId');

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!adminDocId) return;
            const adminDocRef = doc(db, 'admins', adminDocId);
            const docSnapshot = await getDoc(adminDocRef);

            if (docSnapshot.exists()) {
                const recoveryQuestions = docSnapshot.data().recoveryQuestions || [];
                const selectedQuestions = recoveryQuestions.sort(() => 0.5 - Math.random()).slice(0, 2);
                setCustomQuestions(selectedQuestions);
            }
        };

        fetchQuestions();
    }, [adminDocId]);

    const handleAnswerChange = (question, answer) => {
        setCustomAnswers((prev) => ({ ...prev, [question]: answer }));
    };

    const checkAnswers = async () => {
        const adminDocRef = doc(db, 'admins', adminDocId);
        const docSnapshot = await getDoc(adminDocRef);
        const storedAnswers = docSnapshot.data().answers || {};
        let correctCount = 0;

        customQuestions.forEach((question) => {
            if (customAnswers[question] === storedAnswers[question]) {
                correctCount++;
            }
        });

        if (correctCount >= 2) {
            navigate('/ResetPasswordMode'); // Navigate to reset password page
        } else {
            setError('Incorrect answers to the security questions.');
        }
    };

    return (
        <Container fluid='lg'>
            <div className="Container-" style={{ border: "1px solid", borderRadius: "15px", padding: "20px" }}>
                <div>
                    <span><FaLock size={20} /></span>
                    <p className="fs-4">Enable Recovery Mode</p>
                    <p>Text Here</p>
                </div>
                <div>
                    {customQuestions.map((question, index) => (
                        <FloatingLabel key={index} controlId={`floatingAnswer${index}`} label={question} className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Answer"
                                onChange={(e) => handleAnswerChange(question, e.target.value)}
                            />
                        </FloatingLabel>
                    ))}
                    <Button variant="primary" onClick={checkAnswers}>
                        Verify Answers
                    </Button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
            </div>
        </Container>
    );
}

export default EnableRecoveryMode;
