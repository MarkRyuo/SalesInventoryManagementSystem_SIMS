import { Container, Row, Col, Button } from "react-bootstrap";
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate } from "react-router-dom";

function PosScanner() {
    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack size={20} />,
            path: "/ScanAsset",
            id: 1
        }
    ]);
    
    const [scannedItems, setScannedItems] = useState([]); // List to hold scanned items
    const videoRef = useRef(null);
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader
            .listVideoInputDevices()
            .then((videoInputDevices) => {
                // Select the first camera on the device
                codeReader.decodeFromVideoDevice(
                    videoInputDevices[0].deviceId,
                    videoRef.current,
                    (result, error) => {
                        if (result) {
                            const scannedText = result.getText();
                            setScannedItems(prevItems => [...prevItems, scannedText]); // Add scanned item to list
                            codeReader.reset(); // Stops scanning after each successful scan
                        }
                        if (error) {
                            console.error(error); // Log errors for debugging
                        }
                    }
                );
            })
            .catch((err) => console.error("Error listing video devices", err));

        return () => {
            codeReader.reset(); // Stop the scanner when component unmounts
        };
    }, []);

    const handleCheckout = () => {
        // Navigate to the ScanAssetsMode component and pass scanned items
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
                        {scannedItems.length > 0 && (
                            <p>Scanned Items: {scannedItems.join(', ')}</p>
                        )}
                        <Button style={{ width: 200 }} variant="primary" size="lg" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PosScanner;
