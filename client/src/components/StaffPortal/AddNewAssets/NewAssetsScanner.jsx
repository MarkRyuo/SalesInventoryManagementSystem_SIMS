import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database'; // Import Firebase Realtime Database functions

function NewAssetsScanner() {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const db = getDatabase(); // Get the database instance

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        const startScanner = async () => {
            try {
                const videoInputDevices = await codeReader.listVideoInputDevices();
                const firstDeviceId = videoInputDevices[0].deviceId;

                codeReader.decodeFromVideoDevice(firstDeviceId, videoRef.current, async (result, err) => {
                    if (result) {
                        const barcode = result.text;

                        // Check if the product exists in the database
                        const productRef = ref(db, 'products/' + barcode); // Assuming 'products' is your database node
                        const snapshot = await get(productRef);

                        if (snapshot.exists()) {
                            // Product exists, update quantity
                            const productData = snapshot.val();
                            const newQuantity = productData.quantity + 1; // Increase quantity by 1

                            // Update the product in the database
                            await update(productRef, { quantity: newQuantity });
                            alert('Product quantity updated!'); // Optional: Display success message
                        } else {
                            // Product does not exist, navigate to NewAssets
                            navigate('/NewAssets', { state: { barcode } });
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

        return () => {
            codeReader.reset();
        };
    }, [navigate, db]);

    return (
        <Container className="mt-4">
            <h1 className="text-center">Scanner</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <div className="text-center">
                            {error && <Alert variant="danger">Error: {error}</Alert>}
                            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NewAssetsScanner;
