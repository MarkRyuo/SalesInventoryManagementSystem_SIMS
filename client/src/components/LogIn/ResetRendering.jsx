import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ResetRendering() {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = [
        'Processing your password...',
        'Please wait...',
        'Still working on it...',
        'Almost there...',
        'Finalizing the update...'
    ];
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000); // Change the message every second

        // Navigate to '/' after 5 seconds
        const timeout = setTimeout(() => {
            navigate('/');
        }, 9000);

        // Clean up intervals and timeout when the component is unmounted
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [navigate]);

    return (
        <Container fluid="lg" className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
            <h2>{messages[messageIndex]}</h2>
        </Container>
    );
}

export default ResetRendering;
