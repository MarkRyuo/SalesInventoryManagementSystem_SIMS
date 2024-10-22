import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService'; // Import the services

function NewAssetsScanner() {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startScanner = async () => {
            try {
                const videoInputDevices = await codeReader.listVideoInputDevices();
                const firstDeviceId = videoInputDevices[0].deviceId;

                codeReader.decodeFromVideoDevice(firstDeviceId, videoRef.current, async (result, err) => {
                    if (result) {
                        const barcode = result.text;

                        try {
                            const product = await fetchProductByBarcode(barcode);
                            if (product) {
                                // Update product quantity
                                const updatedQuantity = await updateProductQuantity(barcode, product);
                                setMessage(`Quantity updated for ${product.productName}: New Quantity is ${updatedQuantity}.`);
                            } else {
                                // If product does not exist, navigate to NewAssets
                                navigate('/NewAssets', { state: { barcode: barcode } });
                            }
                        } catch (error) {
                            setError(error.message);
                        }
                    }
                    if (err && !(err instanceof NotFoundException)) {
                        setError(err.message);
                    }
                });
            } catch (err) {
                setError("Failed to initialize scanner: " + err.message);
            }
        };

        startScanner();

        // Cleanup on unmount
        return () => {
            codeReader.reset();
        };
    }, [navigate]);

    return (
        <Container className="mt-4">
            <h1 className="text-center">Scanner</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <div className="text-center">
                            {error && <Alert variant="danger">Error: {error}</Alert>}
                            {message && <Alert variant="success">{message}</Alert>}
                            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NewAssetsScanner;
