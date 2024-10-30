import { Container, Row, Col } from "react-bootstrap";
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
        <Container fluid>
            <StaffNavBar backBtn={backBtn.filter((Backbtn) => Backbtn.id === 1)} />
            <Container fluid="lg" style={{ boxSizing: "border-box", border: '1px solid blue', height: '80vh', padding: 15 }}>
                <Row style={{ boxSizing: "border-box", border: '1px solid green', height: 'auto', padding: 15}}>
                    <Col style={{ boxSizing: "border-box", border: '1px solid red' }}>
                        <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
                        {scannedResult && (
                            <p>Scanned Result: {scannedResult}</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PosScanner;
