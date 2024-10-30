import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState, useEffect, useRef, useCallback } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService';

function PosScanner() {
    const location = useLocation();
    const [backBtn] = useState([{ btnIcon: <IoMdArrowBack size={20} />, path: "/ScanAsset", id: 1 }]);
    const [scannedItems, setScannedItems] = useState(location.state?.scannedItems || []);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fadeClass, setFadeClass] = useState('');
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const scannedRef = useRef(new Set());
    const [message, setMessage] = useState('');
    const [fadeOut, setFadeOut] = useState(false);

    const handleScan = useCallback(async (scannedText) => {
        setIsLoading(true);
        setFadeClass('fade-in');

        // Check for duplicates
        if (scannedRef.current.has(scannedText)) {
            setIsLoading(false);
            return; // Skip if this barcode has already been scanned
        }
        scannedRef.current.add(scannedText);

        try {
            const product = await fetchProductByBarcode(scannedText);
            if (product) {
                const existingIndex = scannedItems.findIndex(item => item.barcode === scannedText);

                if (existingIndex !== -1) {
                    await updateProductQuantity(scannedText, -1);
                    setScannedItems(prevItems => {
                        const updatedItems = [...prevItems];
                        updatedItems[existingIndex].quantity += 1;
                        return updatedItems;
                    });
                } else {
                    await updateProductQuantity(scannedText, -1);
                    setScannedItems(prevItems => [...prevItems, { ...product, quantity: 1 }]);
                }

                setMessage(`Scanned ${product.productName}: Quantity updated!`);
                setErrorMessages([]);
            } else {
                setErrorMessages(prev => [...prev, `Product with barcode ${scannedText} not found in inventory.`]);
            }
        } catch (error) {
            setErrorMessages(prev => [...prev, `Error fetching product: ${error.message}`]);
        }

        // Reset the loading state and fade effects
        setTimeout(() => {
            setIsLoading(false);
            setFadeClass('fade-out');
            scannedRef.current.delete(scannedText);
            setFadeOut(true);
            setTimeout(() => {
                setFadeOut(false);
                setMessage('');
            }, 1000);
        }, 2000);
    }, [scannedItems]);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader.listVideoInputDevices().then((videoInputDevices) => {
            if (videoInputDevices.length > 0) {
                codeReader.decodeFromVideoDevice(videoInputDevices[0].deviceId, videoRef.current, (result, error) => {
                    if (result && !isLoading) {
                        handleScan(result.getText());
                    }
                    if (error) {
                        console.error(error);
                    }
                });
            } else {
                setErrorMessages(['No camera found.']);
            }
        }).catch((err) => console.error("Error listing video devices", err));

        return () => {
            codeReader.reset();
        };
    }, [handleScan, isLoading]);

    const handleCheckout = () => {
        navigate('/ScanAssetsMode', { state: { scannedItems } });
    };

    return (
        <Container fluid className="m-0 p-0">
            <StaffNavBar backBtn={backBtn.filter((Backbtn) => Backbtn.id === 1)} />
            <Container fluid="lg" style={{ boxSizing: "border-box", height: '90vh', width: '100%', minWidth: 380 }}>
                <Row style={{ boxSizing: "border-box", height: '100%' }}>
                    <Col lg={12} style={{
                        boxSizing: "border-box",
                        height: '80vh',
                        width: '100%',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 0,
                        gap: 30
                    }}>
                        <video ref={videoRef} style={{ width: "100%", height: "80%", maxWidth: 800 }} />
                        {isLoading ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            <>
                                {scannedItems.length > 0 && (
                                    <ul className={fadeClass}>
                                        {scannedItems.map((item, index) => (
                                            <li key={index}>{item.productName} - Quantity: {item.quantity}</li>
                                        ))}
                                    </ul>
                                )}
                                {errorMessages.length > 0 && (
                                    <div style={{ color: 'red' }}>
                                        {errorMessages.map((msg, index) => (
                                            <p key={index}>{msg}</p>
                                        ))}
                                    </div>
                                )}
                                {message && (
                                    <Alert variant="success" style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 1s ease-in-out' }}>
                                        {message}
                                    </Alert>
                                )}
                            </>
                        )}
                        <Button style={{ width: 200 }} variant="primary" size="lg" onClick={handleCheckout} disabled={isLoading}>
                            Checkout
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PosScanner;
