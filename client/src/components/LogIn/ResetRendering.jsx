import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CSS/ResetRendering.css';

function ResetRendering() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [dotCount, setDotCount] = useState(1);
    const messages = [
        'Processing your password',
        'Please wait',
        'Still working on it',
        'Almost there',
        'Finalizing the update'
    ];
    const navigate = useNavigate();

    useEffect(() => {
        // Change the message with a fade-out effect every 3 seconds
        const messageInterval = setInterval(() => {
            setFadeOut(true); // Start fade-out
            setTimeout(() => {
                setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setFadeOut(false); // Reset fade-out after changing message
            }, 500); // Adjust timing for the fade-out effect (0.5 seconds)
        }, 3000); // Change the message every 3 seconds

        // Dot animation
        const dotInterval = setInterval(() => {
            setDotCount((prevCount) => (prevCount % 3) + 1); // Loop from 1 to 3 dots
        }, 500); // Change dots every 0.5 seconds

        // Navigate to '/' after 7 seconds
        const timeout = setTimeout(() => {
            navigate('/');
        }, 7000);

        // Clean up intervals and timeout when the component is unmounted
        return () => {
            clearInterval(messageInterval);
            clearInterval(dotInterval);
            clearTimeout(timeout);
        };
    }, [navigate]);

    return (
        <Container
            fluid="lg"
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ height: '100vh' }}
        >
            <h2 className={`fade ${fadeOut ? 'fade-out' : ''}`}>
                {messages[messageIndex]}
                <span className="dots">{'.'.repeat(dotCount)}</span>
            </h2>
        </Container>
    );
}

export default ResetRendering;
