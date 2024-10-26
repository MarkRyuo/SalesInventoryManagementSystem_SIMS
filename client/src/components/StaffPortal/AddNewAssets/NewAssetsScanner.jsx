import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService';
import { IoMdArrowBack } from "react-icons/io";
import StaffNavBar from "../../StaffPortal/StaffNavbar/StaffNavBar";



function NewAssetsScanner() {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [scanning, setScanning] = useState(true);
    const [lastScannedBarcode, setLastScannedBarcode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [videoFade, setVideoFade] = useState(true);
    const [guideFade, setGuideFade] = useState(true);
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

                        if (barcode !== lastScannedBarcode) {
                            setLastScannedBarcode(barcode);
                            setScanning(false);
                            setIsProcessing(true);
                            setVideoFade(false);
                            setGuideFade(false);

                            codeReader.reset();

                            try {
                                const product = await fetchProductByBarcode(barcode);

                                if (product) {
                                    const additionalQuantity = 1; // Increment quantity as needed
                                    const updatedQuantity = await updateProductQuantity(barcode, additionalQuantity); // Get updated quantity

                                    const productName = product.productName || "Unknown Product";
                                    const newQuantity = updatedQuantity; // This now holds the updated quantity

                                    setMessage(`Quantity updated for ${productName}: New Quantity is ${newQuantity}.`);
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
                                        setGuideFade(true);
                                        setScanning(true);
                                        startScanner(); // Restart scanning
                                    }, 1000);
                                }, 2000);

                            } catch (error) {
                                setError(error.message || "An unexpected error occurred.");
                                resetScanner();
                            }
                        }
                    }

                    if (err && !(err instanceof NotFoundException)) {
                        setError(err.message || "An unexpected error occurred.");
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

    const resetScanner = () => {
        setScanning(true);
        setLastScannedBarcode('');
        setIsProcessing(false);
        setVideoFade(true);
        setGuideFade(true);
    };

    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack size={20} />,
            path: "/ScanAsset",
            id: 1
        }
    ]);

    return (
        <Container fluid>
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid='lg' style={{ width: '100%', height: '80vh', boxSizing: 'border-box' }}>  {/* Parent */}
                <Row className="justify-content-center" style={{ height: '100%', boxSizing: 'border-box' }}> {/* Sub parent */}
                    <Col md={8} className='p-0' style={{ display: 'flex', justifyContent: 'center'}}> {/* Child */}
                        <Card style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
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
                                        width: '70%',
                                        height: '50%',
                                        border: '1px dashed rgba(255, 255, 255, 0.8)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        pointerEvents: 'none',
                                        opacity: guideFade ? 1 : 0,
                                        transition: 'opacity 1s ease-in-out',
                                    }}
                                />

                                <video
                                    ref={videoRef}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '80vh',  // Limits height to fit within the viewport
                                        display: isProcessing ? 'none' : 'block',
                                        opacity: videoFade ? 1 : 0,
                                        transition: 'opacity 1s ease-in-out'
                                    }}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </Container>
        
    );
}

export default NewAssetsScanner;
