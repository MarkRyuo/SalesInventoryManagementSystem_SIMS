/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Alert, Spinner, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchProductByBarcode, updateProductQuantity } from '../../../services/ProductService';
import { IoMdArrowBack } from "react-icons/io";
import StaffNavBar from "../../StaffPortal/StaffNavbar/StaffNavBar";
import NewProductscss from './NewProduct.module.scss';
import { MdCameraswitch } from "react-icons/md";

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
    const [videoDevices, setVideoDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const navigate = useNavigate();

    //! Modal State
    const [showModal, setShowModal] = useState(false);
    const [customQuantity, setCustomQuantity] = useState(1);

    const codeReader = new BrowserMultiFormatReader();

    useEffect(() => {
    const startScanner = async (deviceId = null) => {
        try {
            const devices = await codeReader.listVideoInputDevices();
            setVideoDevices(devices);

            if (devices.length === 0) {
                throw new Error("No video devices found.");
            }

            const backCamera = devices.find(device =>
                device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')
            );
            const selectedDevice = deviceId || (backCamera ? backCamera.deviceId : devices[0]?.deviceId);
            setSelectedDeviceId(selectedDevice);

            codeReader.decodeFromVideoDevice(selectedDevice, videoRef.current, async (result, err) => {
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
                                const additionalQuantity = 1;
                                const updatedQuantity = await updateProductQuantity(barcode, additionalQuantity);

                                const productName = product.productName || "Unknown Product";
                                setMessage(`Updated: ${productName}: ${updatedQuantity}.`);
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
                                    startScanner(selectedDeviceId);
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

    startScanner(selectedDeviceId);

    return () => {
        codeReader.reset();
    };
}, [navigate, scanning, lastScannedBarcode, selectedDeviceId]);

    const resetScanner = () => {
        setScanning(true);
        setLastScannedBarcode('');
        setIsProcessing(false);
        setVideoFade(true);
        setGuideFade(true);
    };

    const handleCameraSwitch = () => {
        if (videoDevices.length > 1) {
            const currentIndex = videoDevices.findIndex(device => device.deviceId === selectedDeviceId);
            const nextIndex = (currentIndex + 1) % videoDevices.length;
            const nextDeviceId = videoDevices[nextIndex]?.deviceId || videoDevices[0].deviceId;
            setSelectedDeviceId(nextDeviceId);
            setScanning(false);
            setTimeout(() => {
                setScanning(true);
            }, 300);
        }
    };

    //! Handle Bulk Update
    const handleBulkUpdate = async () => {
        setShowModal(false);
        setIsProcessing(true);

        try {
            const product = await fetchProductByBarcode(lastScannedBarcode);
            if (product) {
                const updatedQuantity = await updateProductQuantity(lastScannedBarcode, customQuantity);
                const productName = product.productName || "Unknown Product";
                setMessage(`Bulk Updated: ${productName}: ${updatedQuantity}.`);

                setTimeout(() => {
                    setFadeOut(true);
                    setTimeout(() => {
                        setFadeOut(false);
                        setMessage('');
                    }, 2000);
                }, 2000);
            } else {
                setError("Product not found.");
            }
        } catch (error) {
            setError(error.message || "An unexpected error occurred.");
        } finally {
            setIsProcessing(false);
            setCustomQuantity(1);
        }
    };

    return (
        <Container fluid className='m-0 p-0' style={{ height: '100vh', background: " radial-gradient(800px at 0.7% 3.4%, rgb(164, 231, 192) 0%, rgb(245, 255, 244) 80%)" }}>
            <StaffNavBar backBtn={[{ btnIcon: <IoMdArrowBack size={20} />, path: "/AddNewAssets", id: 1 }]} />
            <Container fluid='lg' className={NewProductscss.NewProductContainer}>
                <div className={NewProductscss.NewProductCol}>
                    <div>
                        <Button onClick={handleCameraSwitch} variant='primary' className="mb-2" disabled={isProcessing}>
                            <MdCameraswitch size={20} className="me-2" />
                            Switch Camera
                        </Button>

                        <div className={NewProductscss.NewProductCamera}>
                            <div>
                                {error && (
                                    <Alert variant="" style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 1s ease-in-out' }}>
                                        {/* Error: {error} */}
                                    </Alert>
                                )}
                                {message && (
                                    <Alert variant="success" style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 1s ease-in-out' }}>
                                        {message}
                                    </Alert>
                                )}
                            </div>
                            {isProcessing && <Spinner animation="grow" variant="success" />}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '50%', border: '2px dashed rgba(255, 255, 255, 0.5)', backgroundColor: 'rgba(0, 0, 0, 0.1)', pointerEvents: 'none', opacity: guideFade ? 1 : 0, transition: 'opacity 1s ease-in-out' }} />
                            <video ref={videoRef} style={{ display: isProcessing ? 'none' : 'block', opacity: videoFade ? 1 : 0, transition: 'opacity 1s ease-in-out' }} />
                        </div>
                        <Button onClick={() => setShowModal(true)} variant='primary' className="my-2" disabled={!lastScannedBarcode || isProcessing}>
                            Bulk Update
                        </Button>
                    </div>
                </div>
            </Container>

            {/* Bulk Update Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Update Quantity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="customQuantity">
                            <Form.Label>Enter Quantity:</Form.Label>
                            <Form.Control
                                type="number"
                                value={customQuantity}
                                onChange={(e) => setCustomQuantity(parseInt(e.target.value) || 1)}
                                min="1"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleBulkUpdate} disabled={customQuantity < 1}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default NewAssetsScanner;