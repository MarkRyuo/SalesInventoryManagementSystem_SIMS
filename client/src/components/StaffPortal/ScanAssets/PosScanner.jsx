import { Container, Row, Col, Button } from "react-bootstrap";
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { BrowserMultiFormatReader } from "@zxing/library";

function PosScanner() {
    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack size={20} />,
            path: "/ScanAsset",
            id: 1
        }
    ]);

    const [scannedResult, setScannedResult] = useState("");
    const videoRef = useRef(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader
            .listVideoInputDevices()
            .then((videoInputDevices) => {
                // Select the first camera on the device (you may prompt user for selection if there are multiple)
                codeReader.decodeFromVideoDevice(
                    videoInputDevices[0].deviceId,
                    videoRef.current,
                    (result, error) => {
                        if (result) {
                            setScannedResult(result.getText());
                            codeReader.reset(); // Stops scanning after the first successful scan
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

    return (
        <Container fluid className="m-0 p-0">
            <StaffNavBar backBtn={backBtn.filter((Backbtn) => Backbtn.id === 1)} />
            <Container fluid="lg" style={{ boxSizing: "border-box", border: '1px solid blue', height: '90vh'}}>
                <Row style={{ boxSizing: "border-box", border: '1px solid green', height: '100%'}}>
                    <Col lg={12} style={{ boxSizing: "border-box", border: '1px solid red', height: '65vh', width: '100%', display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <video ref={videoRef} style={{ width: "100%", height: "100%", maxWidth: 800}} />
                        {scannedResult && (
                            <p>Scanned Result: {scannedResult}</p>
                        )}
                        <Button style={{}}>Checkout</Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PosScanner;
