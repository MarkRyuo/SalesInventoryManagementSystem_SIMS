import { useState, useEffect } from 'react';
import AddQrcode from "./AddQrcode";
import { Container, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { fetchQRCodesFromDatabase } from '../../../services/ProductService';

function ProductListWithQRCodes() {
    const [showModal, setShowModal] = useState(false);
    const [qrCodes, setQRCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Handle opening the modal
    const handleShowModal = () => setShowModal(true);

    // Handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
        fetchQRCodes(); // Refresh the QR code list after closing modal
    };

    // Fetch QR codes from the database
    const fetchQRCodes = async () => {
        try {
            setIsLoading(true);
            const fetchedQRCodes = await fetchQRCodesFromDatabase();
            setQRCodes(fetchedQRCodes);
        } catch (error) {
            setError(`Failed to load QR codes: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Load QR codes on component mount
    useEffect(() => {
        fetchQRCodes();
    }, []);

    return (
        <Container fluid="lg">
            <h3>List of QR Codes</h3>

            <Button variant="primary" onClick={handleShowModal} className="mb-4">
                Set QR Code for Product
            </Button>
        </Container>
    );
}

export default ProductListWithQRCodes;
