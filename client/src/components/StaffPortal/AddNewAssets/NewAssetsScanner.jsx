import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService';

function NewAssetsScanner() {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [scanning, setScanning] = useState(true);
    const [lastScannedBarcode, setLastScannedBarcode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [videoFade, setVideoFade] = useState(true);
    const [guideFade, setGuideFade] = useState(true); // New state for guideline visibility
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

                        console.log(`Scanned barcode: ${barcode}`);

                        if (barcode !== lastScannedBarcode) {
                            try {
                                setScanning(false);
                                setLastScannedBarcode(barcode);
                                setIsProcessing(true);
                                setVideoFade(false);
                                setGuideFade(false); // Fade out guideline

                                codeReader.reset();

                                const product = await fetchProductByBarcode(barcode);
                                if (product) {
                                    const updatedQuantity = await updateProductQuantity(barcode, product);
                                    setMessage(`Quantity updated for ${product.productName}: New Quantity is ${updatedQuantity}.`);
                                } else {
                                    navigate('/NewAssets', { state: { barcode: barcode } });
                                }

                                setTimeout(() => {
                                    setIsProcessing(false);
                                    setFadeOut(true);

                                    setTimeout(() => {
                                        setFadeOut(false);
                                        setMessage('');
                                        setVideoFade(true);
                                        setGuideFade(true); // Fade in guideline
                                        startScanner();
                                    }, 1000);
                                }, 2000);

                            } catch (error) {
                                setError(error.message);
                                setScanning(true);
                                setLastScannedBarcode('');
                                setIsProcessing(false);
                                setVideoFade(true);
                                setGuideFade(true); // Fade in guideline after error
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

        return () => {
            codeReader.reset();
        };
    }, [navigate, scanning, lastScannedBarcode]);

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <div className="text-center position-relative">
                            {error && (
                                <Alert variant="danger"
                                    style={{
                                        opacity: fadeOut ? 0 : 1,
                                        transition: 'opacity 1s ease-in-out',
                                    }}>
                                    Error: {error}
                                </Alert>
                            )}
                            {message && (
                                <Alert variant="success"
                                    style={{
                                        opacity: fadeOut ? 0 : 1,
                                        transition: 'opacity 1s ease-in-out',
                                    }}>
                                    {message}
                                </Alert>
                            )}
                            {isProcessing && <Spinner animation="border" />}

                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '80%',
                                    height: '50%',
                                    border: '1px dashed rgba(255, 255, 255, 0.8)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    pointerEvents: 'none',
                                    opacity: guideFade ? 1 : 0, // Control guideline opacity
                                    transition: 'opacity 1s ease-in-out', // Updated to 1 second
                                }}
                            />

                            <video
                                ref={videoRef}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: isProcessing ? 'none' : 'block',
                                    opacity: videoFade ? 1 : 0,
                                    transition: 'opacity 1s ease-in-out',
                                }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NewAssetsScanner;
