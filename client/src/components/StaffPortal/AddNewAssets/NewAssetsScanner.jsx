import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, set } from 'firebase/database';

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
                        const db = getDatabase();
                        const productRef = ref(db, 'products/' + barcode);

                        try {
                            // Check if the product exists in the database
                            const snapshot = await get(productRef);
                            if (snapshot.exists()) {
                                const existingProduct = snapshot.val();

                                // Ensure quantity is treated as a number
                                const updatedQuantity = (existingProduct.quantity || 0) + 1; // Default to 0 if quantity is undefined

                                // Update the product's quantity in the database
                                await set(ref(db, 'products/' + barcode), {
                                    ...existingProduct,
                                    quantity: updatedQuantity, // Increment existing quantity
                                });

                                setMessage(`Quantity updated for ${existingProduct.productName}: +1 added.`);
                            } else {
                                // If the product does not exist, navigate to NewAssets
                                navigate('/NewAssets', { state: { barcode: barcode } });
                            }
                        } catch (error) {
                            setError("Error fetching product: " + error.message);
                        }
                    }
                    if (err) {
                        if (!(err instanceof NotFoundException)) {
                            setError(err.message);
                        }
                    }
                });
            } catch (err) {
                setError("Failed to initialize scanner: " + err.message);
            }
        };

        startScanner();

        // Cleanup function to reset the scanner on unmount
        return () => {
            codeReader.reset(); // Stop the scanner
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
