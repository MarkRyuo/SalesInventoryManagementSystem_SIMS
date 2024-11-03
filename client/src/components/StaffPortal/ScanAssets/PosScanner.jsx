import { Container, Row, Col, Button, Spinner, Card, Alert } from "react-bootstrap";
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState, useEffect, useRef, useCallback } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchProductByBarcode } from '../../../services/ProductService';

function PosScanner() {
    const location = useLocation();
    const navigate = useNavigate();

    const [backBtn] = useState([{ btnIcon: <IoMdArrowBack size={20} />, path: "/ScanAsset", id: 1 }]);
    const [scannedItems, setScannedItems] = useState(location.state?.scannedItems || []);
    const [errorMessages, setErrorMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cameraLoading, setCameraLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const videoRef = useRef(null);
    const scanningInProgress = useRef(false); // Flag to manage scanning state

    const handleScan = useCallback(async (scannedText) => {
        if (isLoading || scanningInProgress.current) return; // Prevent scanning if loading or already scanning

        scanningInProgress.current = true; // Set scanning in progress
        setErrorMessages([]);
        setMessage("");

        try {
            setIsLoading(true); // Start loading
            const product = await fetchProductByBarcode(scannedText);
            if (product) {
                // Find if the product already exists in the scanned items
                setScannedItems(prevItems => {
                    const existingIndex = prevItems.findIndex(item => item.barcode === scannedText);
                    if (existingIndex !== -1) {
                        // Product already scanned, increment quantity
                        const updatedItems = [...prevItems];
                        updatedItems[existingIndex].quantity += 1; // Increment quantity
                        return updatedItems; // Return updated list
                    } else {
                        // New product scanned, add it to the list
                        return [
                            ...prevItems,
                            { ...product, quantity: 1 } // New product with quantity 1
                        ];
                    }
                });

                setMessage(`Successfully scanned ${product.productName}.`);
                setFadeOut(false);
                setTimeout(() => {
                    setFadeOut(true);
                }, 4000); // Show for 4 seconds
            } else {
                // If no product found, set an error message
                setErrorMessages(prev => [...prev, `No product found for barcode: ${scannedText}`]);
                setFadeOut(false);
                setTimeout(() => {
                    setFadeOut(true);
                }, 4000); // Show for 4 seconds
            }
        } catch (error) {
            setErrorMessages(prev => [...prev, `Error fetching product: ${error.message}`]);
        } finally {
            setIsLoading(false); // Reset loading state

            // Allow scanning again after a delay
            setTimeout(() => {
                scanningInProgress.current = false; // Reset scanning state
            }, 2000); // 2 seconds delay
        }
    }, [isLoading]);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader.listVideoInputDevices().then((videoInputDevices) => {
            if (videoInputDevices.length > 0) {
                const selectedDeviceId = videoInputDevices[0].deviceId;
                codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, error) => {
                    if (result) {
                        handleScan(result.getText());
                    }
                    if (error && !isLoading) {
                        console.error("Scanning error: ", error);
                    }
                });
                setCameraLoading(false);
            } else {
                setErrorMessages(['No camera found.']);
            }
        }).catch((error) => {
            setErrorMessages(['Error accessing video devices.', error.message]);
        });

        return () => {
            codeReader.reset();
        };
    }, [handleScan, isLoading]);

    const handleCheckout = () => {
        navigate('/ScanAssetsMode', { state: { scannedItems } });
    };

    return (
        <Container fluid>
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid='lg' style={{ width: '100%', height: '80vh' }}>
                <Row className="justify-content-center" style={{ height: '100%' }}>
                    <Col md={8} className='p-0 mt-3'>
                        <Card style={{ height: '100%' }}>
                            <div className="text-center position-relative">
                                {errorMessages.length > 0 && (
                                    <Alert variant="danger" style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 1s ease-in-out' }}>
                                        {errorMessages[errorMessages.length - 1]}
                                    </Alert>
                                )}
                                {message && (
                                    <Alert variant="success" style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 1s ease-in-out' }}>
                                        {message}
                                    </Alert>
                                )}
                                {isLoading && <Spinner animation="border" />}

                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '70%',
                                    height: '50%',
                                    border: '1px dashed rgba(255, 255, 255, 0.8)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                }} />

                                <video
                                    ref={videoRef}
                                    style={{
                                        width: '100%',
                                        maxHeight: '80vh',
                                        display: cameraLoading ? 'none' : 'block',
                                        opacity: cameraLoading ? 0 : 1,
                                        transition: 'opacity 1s ease-in-out',
                                    }}
                                />
                                <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', color: 'white' }}>
                                    <p>Please position the barcode within the dashed area and ensure good lighting.</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Col md={8} className="text-center">
                        <Button variant="primary" onClick={handleCheckout} disabled={scannedItems.length === 0}>
                            Proceed to Checkout
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PosScanner;
