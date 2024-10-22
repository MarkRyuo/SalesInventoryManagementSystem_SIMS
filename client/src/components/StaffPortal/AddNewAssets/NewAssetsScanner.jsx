import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService'; // Import the services
import scanningLogo from '../../../assets/scanning-logo.png'; // Import your scanning logo

function NewAssetsScanner() {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [scanning, setScanning] = useState(false); // Manage scanning state to prevent multiple rapid scans
    const [lastScannedBarcode, setLastScannedBarcode] = useState(''); // Track the last scanned barcode
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

                        // Debugging information
                        console.log(`Scanned barcode: ${barcode}`);

                        // Check if it's the same barcode as the last scanned one
                        if (barcode !== lastScannedBarcode) {
                            try {
                                setScanning(true); // Start scanning
                                setLastScannedBarcode(barcode); // Update the last scanned barcode

                                // Stop the video stream to prevent lag issues
                                codeReader.reset();

                                const product = await fetchProductByBarcode(barcode);
                                if (product) {
                                    // Update product quantity
                                    const updatedQuantity = await updateProductQuantity(barcode, product);
                                    setMessage(`Quantity updated for ${product.productName}: New Quantity is ${updatedQuantity}.`);
                                } else {
                                    // If product does not exist, navigate to NewAssets
                                    navigate('/NewAssets', { state: { barcode: barcode } });
                                }

                                // Hide the scanning logo after 2 seconds
                                setTimeout(() => {
                                    setScanning(false); // End scanning
                                    setLastScannedBarcode(''); // Reset last scanned barcode
                                    startScanner(); // Re-initialize the scanner
                                }, 2000);

                            } catch (error) {
                                setError(error.message);
                                setScanning(false); // End scanning after error
                                setLastScannedBarcode(''); // Reset last scanned barcode in case of error
                            }
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
    }, [navigate, lastScannedBarcode]); // Remove scanning from dependencies

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
                            {scanning && (
                                <div className="scanning-overlay">
                                    <img src={scanningLogo} alt="Scanning..." style={{ width: '100px', height: '100px' }} />
                                    <p>Scanning...</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
            <style>{`
                .scanning-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    z-index: 10; /* Ensure it appears above other content */
                    background-color: rgba(255, 255, 255, 0.8); /* Optional: semi-transparent background */
                    padding: 20px; /* Optional: padding for aesthetics */
                    border-radius: 10px; /* Optional: rounded corners */
                }
            `}</style>
        </Container>
    );
}

export default NewAssetsScanner;
