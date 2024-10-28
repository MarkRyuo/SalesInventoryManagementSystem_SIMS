import { Container } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa'; // Import the check icon

function ProductSuccess() {
    return (
        <Container style={{ textAlign: 'center', marginTop: '5rem' }}>
            <FaCheckCircle style={{ fontSize: '100px', color: 'green' }} />
            <h2 style={{ marginTop: '1.5rem' }}>Product successfully added!</h2>
            <p>Your product has been added to the inventory.</p>
        </Container>
    );
}

export default ProductSuccess;
