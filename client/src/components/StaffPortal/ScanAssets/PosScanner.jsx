import { Container, Button, Spinner, Card, Alert } from "react-bootstrap";
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState, useEffect, useRef, useCallback } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchProductByBarcode } from '../../../services/ProductService';
import PosScannerscss from './PosScanner.module.scss';
import { FaCameraRotate } from "react-icons/fa6";

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
    const [isCameraBlocked, setIsCameraBlocked] = useState(false); // New state to block camera
    const videoRef = useRef(null);
    const scanningInProgress = useRef(false); // Flag to manage scanning state
    //! Set up for Back and front camera trigger.
    const [selectedDeviceId, setSelectedDeviceId] = useState(null); // Camera device ID
    const [isUsingBackCamera, setIsUsingBackCamera] = useState(true); // Default to back camera
    const [videoDevices, setVideoDevices] = useState([]); // Store available video devices

    const handleScan = useCallback(async (scannedText) => {
        if (isLoading || scanningInProgress.current) return; // Prevent scanning if loading or already scanning

        scanningInProgress.current = true; // Set scanning in progress
        setErrorMessages([]);
        setMessage("");

        try {
            setIsLoading(true); // Start loading
            const product = await fetchProductByBarcode(scannedText);

            // Check if the product exists and if its quantity is zero
            if (product && product.quantity === 0) {
                setErrorMessages(prev => [...prev, `Cannot scan ${product.productName}. Quantity is zero.`]);
                setFadeOut(false);
                setTimeout(() => {
                    setFadeOut(true);
                }, 4000); // Show for 4 seconds
                return; // Exit early without adding the item
            }

            if (product) {
                // If the product was found and quantity is valid, update the scanned items
                const existingItemIndex = scannedItems.findIndex(item => item.barcode === scannedText);

                setScannedItems(prevItems => {
                    const updatedItems = [...prevItems];
                    if (existingItemIndex !== -1) {
                        // Product already scanned, increment quantity
                        updatedItems[existingItemIndex].quantity += 1;
                    } else {
                        // New product scanned, add it to the list with quantity 1
                        updatedItems.push({ ...product, quantity: 1 });
                    }
                    return updatedItems; // Return updated list
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
            setTimeout(() => {
                scanningInProgress.current = false; // Reset scanning state
            }, 2000); // 2 seconds delay
        }
    }, [isLoading, scannedItems]);

    // Include scannedItems in the dependency array


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


    const handleCameraToggle = () => {
        if (videoDevices.length < 2) {
            setErrorMessages(["Only one camera available. Cannot switch."]);
            return;
        }

        const newCamera = isUsingBackCamera
            ? videoDevices.find(device => device.label.toLowerCase().includes("front")) // Front camera
            : videoDevices.find(device => device.label.toLowerCase().includes("back")); // Back camera

        if (newCamera) {
            setSelectedDeviceId(newCamera.deviceId);
            setIsUsingBackCamera(!isUsingBackCamera); // Toggle camera state
            setCameraLoading(true); // Indicate camera switching
        }
    };

    const handleCheckout = () => {
        navigate('/ScanAssetsMode', { state: { scannedItems } });
    };

    return (
        <Container fluid className="m-0 p-0">
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid='lg' className="p-0">
                <div className={PosScannerscss.PosscannerMessage}>
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
                </div>
                <div className={PosScannerscss.Posscannermain}>
                    <Card className="m-0 p-0">
                        <Button variant="secondary" onClick={handleCameraToggle} disabled={videoDevices.length < 2} className="mt-3">
                            <FaCameraRotate size={20} className="me-2" />
                            Switch to {isUsingBackCamera ? "Front" : "Back"} Camera
                        </Button>

                        {isLoading && <Spinner animation="border" variant="info" />}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '45%',
                            minWidth: "40%",
                            height: '50%',
                            border: '2px dashed rgba(255, 255, 255, 0.5)',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        }} />

                        <video
                            ref={videoRef}
                            style={{
                                display: cameraLoading || isCameraBlocked ? 'none' : 'block', // Block the camera if needed
                                opacity: cameraLoading || isCameraBlocked ? 0 : 1,
                                transition: 'opacity 1s ease-in-out',
                            }}
                        />

                        <Button variant="primary" onClick={handleCheckout} disabled={scannedItems.length === 0} className="mb-2">
                            Proceed to Checkout
                        </Button>
                    </Card>
                </div>
            </Container>
        </Container>
    );
}

export default PosScanner;
