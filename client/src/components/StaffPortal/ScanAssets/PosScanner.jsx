import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService';

function PosScanner() {
    const location = useLocation();
    const [backBtn] = useState([{ btnIcon: <IoMdArrowBack size={20} />, path: "/ScanAsset", id: 1 }]);
    const [scannedItems, setScannedItems] = useState(location.state?.scannedItems || []); // Initialize with existing items if provided
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const scannedRef = useRef(new Set()); // Keeps track of recent scans to prevent double-counting

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader.listVideoInputDevices().then((videoInputDevices) => {
            if (videoInputDevices.length > 0) {
                codeReader.decodeFromVideoDevice(videoInputDevices[0].deviceId, videoRef.current, async (result, error) => {
                    if (result && !isLoading && !scannedRef.current.has(result.getText())) {
                        const scannedText = result.getText();
                        setIsLoading(true);
                        scannedRef.current.add(scannedText); // Add to recent scans set to prevent double-count

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
                                setErrorMessages([]);
                            } else {
                                setErrorMessages(prev => [...prev, `Product with barcode ${scannedText} not found in inventory.`]);
                            }
                        } catch (error) {
                            setErrorMessages(prev => [...prev, `Error fetching product: ${error.message}`]);
                        }

                        setTimeout(() => {
                            setIsLoading(false);
                            scannedRef.current.delete(scannedText); // Allow rescan after delay
                        }, 2000);
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
    }, [scannedItems, isLoading]);

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
                                    <ul>
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
