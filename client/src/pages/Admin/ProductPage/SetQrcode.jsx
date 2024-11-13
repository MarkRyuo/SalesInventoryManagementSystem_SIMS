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
            <h3>Product List with QR Codes</h3>

            <Button variant="primary" onClick={handleShowModal} className="mb-4">
                Set QR Code for Product
            </Button>

            <AddQrcode
                showModal={showModal}
                handleCloseModal={handleCloseModal}
            />

            {isLoading && <Spinner animation="border" className="d-block mx-auto" />}

            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                {!isLoading && qrCodes.length === 0 && (
                    <Col className="text-center">
                        <p>No QR Codes available.</p>
                    </Col>
                )}

                {qrCodes.map((qrCode) => (
                    <Col key={qrCode.barcode} md={4} sm={6} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Barcode: {qrCode.barcode}</Card.Title>
                                <div className="text-center">
                                    <img
                                        src={qrCode.qrcodeBase64}
                                        alt={`QR Code for ${qrCode.barcode}`}
                                        style={{ width: '200px', height: '200px' }}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ProductListWithQRCodes;
