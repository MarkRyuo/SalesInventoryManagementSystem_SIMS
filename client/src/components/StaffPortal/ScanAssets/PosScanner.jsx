import { Container, Row, Col, Button, Spinner, Card, Alert } from "react-bootstrap";
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
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const scannedRef = useRef(new Set()); // Set to track scanned barcodes

    const handleScan = useCallback(async (scannedText) => {
        if (isLoading || scannedRef.current.has(scannedText)) {
            return; // Skip if already loading or already scanned
        }

        setIsLoading(true);
        scannedRef.current.add(scannedText); // Mark the barcode as scanned

        try {
            const product = await fetchProductByBarcode(scannedText);
            if (product) {
                const existingIndex = scannedItems.findIndex(item => item.barcode === scannedText);

                if (existingIndex !== -1) {
                    // Update quantity if product already exists
                    setScannedItems(prevItems => {
                        const updatedItems = [...prevItems];
                        updatedItems[existingIndex].quantity += 1; // Increment quantity
                        return updatedItems;
                    });
                } else {
                    // Add new product to scanned items
                    setScannedItems(prevItems => [
                        ...prevItems,
                        { ...product, quantity: 1 } // Initialize quantity to 1 for new product
                    ]);
                }

                await updateProductQuantity(scannedText, -1); // Update inventory quantity by decrementing 1
                setMessage(`Successfully scanned ${product.name}.`);
                setErrorMessages([]);
                setFadeOut(true);
            } else {
                setErrorMessages(prev => [...prev, `Product with barcode ${scannedText} not found in inventory.`]);
            }
        } catch (error) {
            setErrorMessages(prev => [...prev, `Error fetching product: ${error.message}`]);
        } finally {
            setIsLoading(false); // Always set loading to false
            setTimeout(() => {
                scannedRef.current.delete(scannedText); // Remove the barcode from scannedRef after processing
                setFadeOut(false); // Reset fadeOut after 3 seconds
            }, 3000); // Adjust the delay as necessary
        }
    }, [scannedItems, isLoading]);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader.listVideoInputDevices().then((videoInputDevices) => {
            if (videoInputDevices.length > 0) {
                const selectedDeviceId = videoInputDevices[0].deviceId;
                codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, error) => {
                    if (result) {
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
    }, [handleScan]);

    const handleCheckout = () => {
        navigate('/ScanAssetsMode', { state: { scannedItems } });
    };

    return (
        <Container fluid>
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid='lg' style={{ width: '100%', height: '80vh', boxSizing: 'border-box' }}>
                <Row className="justify-content-center" style={{ height: '100%', boxSizing: 'border-box' }}>
                    <Col md={8} className='p-0 mt-3' style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card style={{ height: '100%', display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="text-center position-relative">
                                {errorMessages.length > 0 && (
                                    <Alert variant="danger"
                                        style={{
                                            opacity: fadeOut ? 0 : 1,
                                            transition: 'opacity 1s ease-in-out',
                                        }}>
                                        {errorMessages[errorMessages.length - 1]}
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
                                {isLoading && <Spinner animation="border" />}

                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '70%',
                                        height: '50%',
                                        border: '1px dashed rgba(255, 255, 255, 0.8)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        pointerEvents: 'none',
                                        opacity: 1,
                                        transition: 'opacity 1s ease-in-out',
                                    }}
                                />

                                <video
                                    ref={videoRef}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '80vh',
                                        display: isLoading ? 'none' : 'block',
                                        opacity: 1,
                                        transition: 'opacity 1s ease-in-out'
                                    }}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Col md={8} className="text-center">
                        <Button
                            variant="primary"
                            onClick={handleCheckout}
                            disabled={scannedItems.length === 0} // Disable if no items scanned
                        >
                            Proceed to Checkout
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PosScanner;
