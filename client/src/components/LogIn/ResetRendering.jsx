/* eslint-disable react-hooks/exhaustive-deps */
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
        'Finalizing the Password update...'
    ];
    const navigate = useNavigate();

    useEffect(() => {
        // Change the message every 2 seconds with a fade-out effect
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 1000); // Change the message every 1 seconds

        // Navigate to '/' after 12 seconds (6 messages * 2 seconds + 2 seconds extra)
        const timeout = setTimeout(() => {
            navigate('/');
        }, 12000);

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
