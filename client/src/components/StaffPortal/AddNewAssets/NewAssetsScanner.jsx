import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Row, Col, Alert, Card, Spinner } from 'react-bootstrap'; // Import Spinner from react-bootstrap
import { useNavigate } from 'react-router-dom';
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService'; // Import the services

function NewAssetsScanner() {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [scanning, setScanning] = useState(true); // Manage scanning state to prevent multiple rapid scans
    const [lastScannedBarcode, setLastScannedBarcode] = useState(''); // Track the last scanned barcode
    const [isProcessing, setIsProcessing] = useState(false); // Loading state for processing
    const [fadeOut, setFadeOut] = useState(false); // Manage fade out state
    const [videoFade, setVideoFade] = useState(true); // State to control video fade
    const [barcodeDetected, setBarcodeDetected] = useState(false); // State to indicate if barcode is detected
    const navigate = useNavigate();

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startScanner = async () => {
            try {
                const videoInputDevices = await codeReader.listVideoInputDevices();
                const firstDeviceId = videoInputDevices[0].deviceId;

                codeReader.decodeFromVideoDevice(firstDeviceId, videoRef.current, async (result, err) => {
                    if (result && scanning) {
                        const barcode = result.text;

                        // Debugging information
                        console.log(`Scanned barcode: ${barcode}`);

                        // Check if it's the same barcode as the last scanned one
                        if (barcode !== lastScannedBarcode) {
                            setBarcodeDetected(true); // Set state to indicate barcode is detected
                            try {
                                setScanning(false); // Disable scanning temporarily
                                setLastScannedBarcode(barcode); // Update the last scanned barcode
                                setIsProcessing(true); // Start processing
                                setVideoFade(false); // Fade out video before processing

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

                                // Freeze camera for 2 seconds and display processing indicator
                                setTimeout(() => {
                                    setIsProcessing(false); // Stop processing
                                    setFadeOut(true); // Start fade out for alerts

                                    // Reset fade out and re-initialize the scanner after 2 seconds
                                    setTimeout(() => {
                                        setFadeOut(false);
                                        setMessage(''); // Clear message after fade out
                                        setVideoFade(true); // Fade in video before restarting scanner
                                        setBarcodeDetected(false); // Reset barcode detected state
                                        startScanner(); // Re-initialize the scanner
                                    }, 1000); // Fade out duration of 1 second
                                }, 2000); // Keep this as is for processing time

                            } catch (error) {
                                setError(error.message);
                                setScanning(true); // Re-enable scanning after error
                                setLastScannedBarcode(''); // Reset last scanned barcode in case of error
                                setIsProcessing(false); // Stop processing
                                setVideoFade(true); // Fade in video after error
                                setBarcodeDetected(false); // Reset barcode detected state
                            }
                        }
                    } else {
                        setBarcodeDetected(false); // Reset state when no barcode is detected
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
    }, [navigate, scanning, lastScannedBarcode]); // Add lastScannedBarcode to dependencies

    return (
        <Container className="mt-4">
            <h1 className="text-center">Scanner</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <div className="text-center" style={{ position: 'relative' }}>
                            {error && (
                                <Alert variant="danger"
                                    style={{
                                        opacity: fadeOut ? 0 : 1,
                                        transition: 'opacity 1s ease-in-out', // Updated to 1 second
                                    }}>
                                    Error: {error}
                                </Alert>
                            )}
                            {message && (
                                <Alert variant="success"
                                    style={{
                                        opacity: fadeOut ? 0 : 1,
                                        transition: 'opacity 1s ease-in-out', // Updated to 1 second
                                    }}>
                                    {message}
                                </Alert>
                            )}
                            {isProcessing && <Spinner animation="border" />} {/* Show spinner while processing */}
                            <video
                                ref={videoRef}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: isProcessing ? 'none' : 'block',
                                    opacity: videoFade ? 1 : 0, // Control video opacity
                                    transition: 'opacity 1s ease-in-out', // Updated to 1 second
                                }}
                            />
                            {barcodeDetected && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '80%',
                                        height: '40%',
                                        border: '2px dashed green',
                                        boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        opacity: 0.8,
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Align Barcode Here</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NewAssetsScanner;
