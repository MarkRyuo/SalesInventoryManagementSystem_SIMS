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
        'Finalizing the Password update...',
        'Done...'
    ];
    const navigate = useNavigate();

    useEffect(() => {
        // Change the message every 2 seconds
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => {
                // Only increment if not at the last message
                if (prevIndex < messages.length - 1) {
                    return prevIndex + 1;
                } else {
                    clearInterval(interval); // Stop interval when the last message is reached
                    return prevIndex;
                }
            });
        }, 2000); // Change the message every 2 seconds

        // Navigate to '/' after displaying all messages (6 messages * 2 seconds = 12 seconds)
        const timeout = setTimeout(() => {
            navigate('/');
        }, messages.length * 1000);

        // Clean up intervals and timeout when the component is unmounted
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [navigate]);

    return (
        <Container
            fluid="lg"
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ height: '100vh' }}
        >
            <p className="fs-3">{messages[messageIndex]}</p>
        </Container>
    );
}

export default ResetRendering;
