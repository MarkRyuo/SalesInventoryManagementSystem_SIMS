/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Container, Button, Row, Col, Alert, Spinner, Modal } from 'react-bootstrap';
import QRious from 'qrious';
import { useLocation } from 'react-router-dom';
import { saveQrcodeToDatabase } from '../../../services/ProductService';

function AddQrcode({ showModal, handleCloseModal }) {
    const location = useLocation();
    const barcode = location.state?.barcode || '';

    const [qrcodeData, setQrcodeData] = useState('');
    const [isQRCodeGenerated, setIsQRCodeGenerated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // QR Code Generation
    const handleGenerateQRCode = () => {
        if (!barcode) {
            setError('Barcode is missing.');
            return;
        }

        try {
            // Initialize Qrious instance
            const qr = new QRious({
                value: barcode,
                size: 200,
                level: 'H', // High error correction level
            });

            // Set QR Code as Base64
            const qrCodeBase64 = qr.toDataURL();
            setQrcodeData(qrCodeBase64); // Set the generated QR code Base64 data
            setIsQRCodeGenerated(true);
            setError('');
        } catch (error) {
            setError('Failed to generate QR Code.');
            console.error(error);
        }
    };

    // Save QR Code to Database
    const handleSave = async () => {
        if (!qrcodeData || !barcode) {
            setError('QR Code data or barcode is missing.');
            return;
        }

        try {
            setIsLoading(true);
            await saveQrcodeToDatabase(barcode, qrcodeData);
            handleCloseModal();
        } catch (error) {
            setError(`Error saving QR Code: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="md">
            <Modal.Header closeButton>
                <Modal.Title>Generate QR Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid="md">
                    <Row className="justify-content-center">
                        <Col sm={12} className="text-center">
                            {error && <Alert variant="danger">{error}</Alert>}
                            {isLoading && <Spinner animation="border" className="mx-auto d-block" />}

                            <Button variant="primary" onClick={handleGenerateQRCode} className="mt-3">
                                Generate QR Code
                            </Button>

                            {isQRCodeGenerated && (
                                <div className="mt-3">
                                    <img src={qrcodeData} alt="QR Code" style={{ width: '200px', height: '200px' }} />
                                </div>
                            )}

                            <Button
                                variant="success"
                                onClick={handleSave}
                                className="mt-3"
                                disabled={!isQRCodeGenerated}
                            >
                                Save QR Code
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default AddQrcode;
