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
    const [canScanAgain, setCanScanAgain] = useState(false); // Track if user can scan again
    const [cameraVisible, setCameraVisible] = useState(true); // Camera visibility state

    const videoRef = useRef(null);
    const scanningInProgress = useRef(false); // Flag to manage scanning state
    const [selectedDeviceId, setSelectedDeviceId] = useState(null); // Camera device ID
    const [isUsingBackCamera, setIsUsingBackCamera] = useState(true); // Default to back camera
    const [videoDevices, setVideoDevices] = useState([]); // Store available video devices

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleScan = useCallback(async (scannedText) => {
        if (isLoading || scanningInProgress.current) return;

        const currentTime = Date.now(); // Get current timestamp
        const timeSinceLastScan = currentTime - lastScanTime.current; // Time difference from last scan

        // Block scanning if the interval between scans is too short (e.g., less than 1000ms)
        if (timeSinceLastScan < 1000) {
            setErrorMessages(prev => [...prev, "Scanning too fast. Please wait!"]);
            setCanScanAgain(false); // Disable scanning until time has passed
            setTimeout(() => {
                setCanScanAgain(true); // Enable scanning again after a delay
                setErrorMessages(prev => prev.filter(msg => msg !== "Scanning too fast. Please wait!"));
            }, 1000); // Delay for 1 second before allowing scanning again
            return;
        }

        scanningInProgress.current = true;
        setErrorMessages([]);
        setMessage("");

        try {
            setIsLoading(true);

            // Delay for 1 second before scanning
            await delay(1000);

            const product = await fetchProductByBarcode(scannedText);

            if (product && product.quantity === 0) {
                setErrorMessages(prev => [...prev, `Cannot scan ${product.productName}. Quantity is 0.`]);
                setFadeOut(false);
                setTimeout(() => setFadeOut(true), 2000);
                return;
            }

            if (product) {
                // Include product ID when updating the scanned items state
                setScannedItems(prevItems => {
                    const existingItemIndex = prevItems.findIndex(item => item.barcode === scannedText);
                    const updatedItems = [...prevItems];

                    if (existingItemIndex === -1) {
                        // Add the product with quantity 1 and include the product ID
                        updatedItems.push({ ...product, quantity: 1, productId: product.id });
                    } else {
                        // If product exists, update its quantity
                        updatedItems[existingItemIndex] = {
                            ...updatedItems[existingItemIndex],
                            quantity: updatedItems[existingItemIndex].quantity + 1
                        };
                    }

                    return updatedItems;
                });

                setMessage(`Successfully scanned ${product.productName}.`);
                setFadeOut(false);
                setTimeout(() => setFadeOut(true), 2000);

                setCameraVisible(false);
                setTimeout(() => setCameraVisible(true), 2000);
            } else {
                setErrorMessages(prev => [...prev, `Product not found: ${scannedText}`]);
                setFadeOut(false);
                setTimeout(() => setFadeOut(true), 2000);
            }
        } catch (error) {
            setErrorMessages(prev => [...prev, `Error fetching product: ${error.message}`]);
        } finally {
            setIsLoading(false);
            scanningInProgress.current = false;
            lastScanTime.current = Date.now();
        }
    }, [isLoading]);

    



    // Store the timestamp of the last scan
    const lastScanTime = useRef(0);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startDecoding = (deviceId) => {
            codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, error) => {
                if (result) {
                    handleScan(result.getText());
                }
                if (error && !isLoading) {
                    console.error("Scanning error: ", error);
                }
            });
        };

        codeReader.listVideoInputDevices().then((videoInputDevices) => {
            setVideoDevices(videoInputDevices);

            const defaultDevice = videoInputDevices.find(device => device.label.toLowerCase().includes("back")) || videoInputDevices[0];
            setSelectedDeviceId(defaultDevice?.deviceId);

            if (defaultDevice) {
                startDecoding(defaultDevice.deviceId);
            } else {
                setErrorMessages(['No camera found.']);
            }

            setCameraLoading(false);
        }).catch((error) => {
            setErrorMessages(['Error accessing video devices.', error.message]);
        });

        return () => {
            codeReader.reset(); // Ensure to reset the reader when unmounting
        };
    }, [handleScan, isLoading, selectedDeviceId]);

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

            // Reset the video stream
            const codeReader = new BrowserMultiFormatReader();
            codeReader.reset(); // Reset the reader to stop the current video stream

            // Start the new camera stream after switching
            setTimeout(() => {
                codeReader.decodeFromVideoDevice(newCamera.deviceId, videoRef.current, (result, error) => {
                    if (result) {
                        handleScan(result.getText());
                    }
                    if (error && !isLoading) {
                        console.error("Scanning error: ", error);
                    }
                });
                setCameraLoading(false); // Camera switching done
            }, 500); // Delay to allow camera reset to complete
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
                    {canScanAgain && (
                        <Alert variant="info" style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 1s ease-in-out' }}>
                            You can scan again.
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
                                display: cameraLoading || isLoading || !cameraVisible ? 'none' : 'block',
                                opacity: cameraLoading || isLoading || !cameraVisible ? 0 : 1,
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
