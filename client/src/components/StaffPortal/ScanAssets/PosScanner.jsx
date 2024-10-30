import { useState, useRef } from 'react';
import { Container, Row, Col, Alert, Card, Spinner, Button } from 'react-bootstrap';
import { IoMdArrowBack } from "react-icons/io";
import StaffNavBar from "../../StaffPortal/StaffNavbar/StaffNavBar";

function PosScanner() {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [guideFade, setGuideFade] = useState(true);
    const [videoFade, setVideoFade] = useState(true);
    const videoRef = useRef(null); // Reference for video element

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
                    <Col md={8} className='p-0 mt-3' style={{ display: 'flex', justifyContent: 'center' }}> {/* Child */}
                        <Card style={{ height: '100%', display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="text-center position-relative">
                                {error && (
                                    <Alert variant="danger"
                                        style={{
                                            opacity: guideFade ? 1 : 0,
                                            transition: 'opacity 1s ease-in-out',
                                        }}>
                                        Error: {error}
                                    </Alert>
                                )}
                                {message && (
                                    <Alert variant="success"
                                        style={{
                                            opacity: guideFade ? 1 : 0,
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
                                <Button variant='primary' style={{width: 200}} size='lg'>Done</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default PosScanner;
