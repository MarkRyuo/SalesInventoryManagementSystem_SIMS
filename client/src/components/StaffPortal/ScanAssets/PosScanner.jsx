import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate } from "react-router-dom";
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService';

function PosScanner() {
    const [backBtn] = useState([{ btnIcon: <IoMdArrowBack size={20} />, path: "/ScanAsset", id: 1 }]);
    const [scannedItems, setScannedItems] = useState([]); // List to hold scanned items
    const [errorMessages, setErrorMessages] = useState([]); // To hold error messages
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const videoRef = useRef(null);
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader.listVideoInputDevices().then((videoInputDevices) => {
            if (videoInputDevices.length > 0) {
                codeReader.decodeFromVideoDevice(videoInputDevices[0].deviceId, videoRef.current, async (result, error) => {
                    if (result && !isLoading) {
                        const scannedText = result.getText();
                        setIsLoading(true); // Set loading state

                        try {
                            const product = await fetchProductByBarcode(scannedText); // Fetch product by barcode

                            if (product) {
                                const existingIndex = scannedItems.findIndex(item => item.barcode === scannedText);

                                if (existingIndex !== -1) {
                                    // Item exists, increase quantity
                                    await updateProductQuantity(scannedText, -1); // Decrease quantity by 1
                                    setScannedItems(prevItems => {
                                        const updatedItems = [...prevItems];
                                        updatedItems[existingIndex].quantity += 1;
                                        return updatedItems;
                                    });
                                } else {
                                    // Item is new, add to scanned items
                                    await updateProductQuantity(scannedText, -1); // Decrease quantity by 1
                                    setScannedItems(prevItems => [...prevItems, { ...product, quantity: 1 }]);
                                }
                                setErrorMessages([]); // Clear any previous error messages
                            } else {
                                setErrorMessages(prev => [...prev, `Product with barcode ${scannedText} not found in inventory.`]);
                            }
                        } catch (error) {
                            setErrorMessages(prev => [...prev, `Error fetching product: ${error.message}`]);
                        }

                        setTimeout(() => {
                            setIsLoading(false); // Reset loading state
                        }, 2000);
                    }
                    if (error) {
                        console.error(error); // Log errors for debugging
                    }
                });
            } else {
                setErrorMessages(['No camera found.']); // Handle no camera case
            }
        }).catch((err) => console.error("Error listing video devices", err));

        return () => {
            codeReader.reset(); // Stop the scanner when component unmounts
        };
    }, [scannedItems, isLoading]); // Add scannedItems and isLoading as dependencies

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
