import { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { addQrcodeToDatabase } from '../../../services/ProductService';
import QRious from 'qrious';
import { useLocation } from 'react-router-dom';

function AddQrcode({ showModal, handleCloseModal }) {
    const location = useLocation();
    const barcodeValue = location.state?.barcode || '';  // Retrieve barcode from location state

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [qrcodeData, setQrcodeData] = useState('');
    const [isQRCodeGenerated, setIsQRCodeGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);  // New state to handle QR Code generation loading

    useEffect(() => {
        if (!barcodeValue) {
            setError('Barcode is missing. Please ensure the product has a barcode.');
        } else {
            setError(''); // Reset error if barcode is available
        }
    }, [barcodeValue]);

    // Handle QR Code generation using QRious
    const handleGenerateQRCode = () => {
        if (!barcodeValue) {
            setError('Barcode is missing. Please ensure the product has a barcode.');
            return;
        }
        try {
            setError('');  // Clear any previous errors
            setIsGenerating(true);  // Set loading state for QR code generation
            const qr = new QRious({
                value: barcodeValue,
                size: 200,
                level: 'H',
            });
            const qrCodeBase64 = qr.toDataURL();
            setQrcodeData(qrCodeBase64);
            setIsQRCodeGenerated(true);
        } catch (error) {
            setError('Failed to generate QR Code.');
            console.error(error);
        } finally {
            setIsGenerating(false);  // Reset loading state after QR code generation
        }
    };

    // Save QR Code to Database
    const handleAdd = async () => {
        try {
            setError('');
            setIsLoading(true);

            if (!qrcodeData) {
                setError('QR Code data is missing.');
                return;
            }
            // Add QR Code to the product's record
            await addQrcodeToDatabase(barcodeValue, qrcodeData);

            handleCloseModal();  // Close the modal after saving
        } catch (error) {
            setError(`Error saving QR Code: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Set QR Code for Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col lg={8} sm={12} className="d-flex flex-column align-items-center">
                            <Button
                                variant="primary"
                                onClick={handleGenerateQRCode}
                                className="mt-3"
                                disabled={isLoading || isGenerating || !barcodeValue}
                            >
                                {isGenerating ? 'Generating...' : 'Generate QR Code'}
                            </Button>

                            {isQRCodeGenerated && (
                                <div className="mt-3">
                                    <img
                                        src={qrcodeData}
                                        alt="Generated QR Code"
                                        style={{ width: '200px', height: '200px' }}
                                    />
                                </div>
                            )}

                            <Button
                                variant="success"
                                onClick={handleAdd}
                                className="mt-3"
                                disabled={!isQRCodeGenerated || isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save QR Code'}
                            </Button>

                            {error && <p className="text-danger mt-3">{error}</p>}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default AddQrcode;
