import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Alert, Card, Spinner, Button } from 'react-bootstrap';
import { IoMdArrowBack } from "react-icons/io";
import StaffNavBar from "../../StaffPortal/StaffNavbar/StaffNavBar";
import { useNavigate } from 'react-router-dom';
import { fetchProductByBarcode } from '../../../services/ProductService';
import { BrowserMultiFormatReader } from '@zxing/library';

function PosScanner() {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentOrders, setCurrentOrders] = useState([]);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const codeReader = new BrowserMultiFormatReader();

    useEffect(() => {
        const startScanner = async () => {
            try {
                // Ensure the video element is available
                if (!videoRef.current) {
                    setError("Video reference is not available.");
                    return;
                }

                // Get the video stream from the user's camera
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", true); // For inline video playback
                videoRef.current.play();

                // Start scanning barcodes
                scanBarcode();
            } catch (err) {
                console.error("Error accessing the camera: ", err);
                setError("Error accessing the camera. Please check permissions.");
            }
        };

        startScanner();

        return () => {
            // Cleanup function to stop the video stream on unmount
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null; // Clean up the video reference
            }
        };
    }, []);

    const scanBarcode = async () => {
        try {
            while (true) {
                const result = await codeReader.decodeOnceFromVideoDevice(null, videoRef.current);
                if (result && result.text) {
                    handleScan(result.text); // Call handleScan with the scanned barcode
                }
            }
        } catch (err) {
            console.error("Scanning error: ", err); // Log the scanning error
        }
    };

    const handleScan = async (barcode) => {
        setIsProcessing(true);
        setMessage(null);
        setError(null);

        try {
            const product = await fetchProductByBarcode(barcode);
            if (product) {
                const existingProduct = currentOrders.find(item => item.barcode === barcode);
                if (existingProduct) {
                    // Update quantity for existing product
                    setCurrentOrders(prev =>
                        prev.map(item =>
                            item.barcode === barcode
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    );
                } else {
                    // Add new product to the current orders
                    setCurrentOrders(prev => [
                        ...prev,
                        { ...product, quantity: 1 }
                    ]);
                }
                setMessage(`Added ${product.productName} to current orders.`);
            } else {
                setError("Product not found in inventory.");
            }
        } catch (err) {
            setError("An error occurred while fetching the product.");
            console.error("Fetch error: ", err); // Log the fetch error
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDoneClick = () => {
        navigate("/ScanAssetsMode", { state: { currentOrders } });
    };

    return (
        <Container fluid>
            <StaffNavBar backBtn={[{ btnIcon: <IoMdArrowBack size={20} />, path: "/ScanAsset" }]} />
            <Container fluid='lg' style={{ width: '100%', height: '80vh', boxSizing: 'border-box' }}>
                <Row className="justify-content-center" style={{ height: '100%', boxSizing: 'border-box' }}>
                    <Col md={8} className='p-0 mt-3' style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card style={{ height: '100%', display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="text-center position-relative">
                                {error && <Alert variant="danger">{error}</Alert>}
                                {message && <Alert variant="success">{message}</Alert>}
                                {isProcessing && <Spinner animation="border" />}
                                <video
                                    ref={videoRef}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '80vh',
                                    }}
                                />
                                <Button
                                    variant='primary'
                                    style={{ width: 200, marginTop: '1rem' }}
                                    size='lg'
                                    onClick={handleDoneClick}
                                    disabled={isProcessing} // Disable button while processing
                                >
                                    Done
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PosScanner;
