import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa'; // Import the check icon
import { useNavigate } from 'react-router-dom';

function ProductSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the scanner page after 3 seconds
        const timer = setTimeout(() => {
            navigate('/NewAssetsScanner'); // Replace '/scanner' with the correct path to your scanner component
        }, 3000); // 3000 milliseconds = 3 seconds

        return () => clearTimeout(timer); // Clean up the timer on component unmount
    }, [navigate]);

    return (
        <Container style={{ textAlign: 'center', marginTop: '20rem' }}>
            <FaCheckCircle style={{ fontSize: '100px', color: 'green' }} />
            <h2 style={{ marginTop: '1.5rem' }}>Product successfully added!</h2>
            <p>Your product has been added to the inventory.</p>
            <p>Redirecting to the scanner...</p> {/* Optional message for user feedback */}
        </Container>
    );
}

export default ProductSuccess;
