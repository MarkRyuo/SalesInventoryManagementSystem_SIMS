import { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Container, Row, Col, Card, Alert, ListGroup } from 'react-bootstrap';

function PosScanner() {
    const videoRef = useRef(null);
    const [scannedItems, setScannedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startScanning = async () => {
            try {
                setLoading(true);
                const result = await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
                    if (result) {
                        setScannedItems((prevItems) => [...prevItems, result.text]);
                        setError('');
                    }
                    if (err && !(err instanceof Error)) {
                        setError(err);
                    }
                });
                console.log(result); // You can log the result for debugging
            } catch (e) {
                console.error('Error starting scanner:', e);
                setError('Error starting scanner');
            } finally {
                setLoading(false);
            }
        };

        startScanning();

        // Cleanup function to stop scanning
        return () => {
            codeReader.reset();
        };
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">POS Scanner</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} autoPlay />
                            {loading && <Alert variant="info">Loading...</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={6} className="offset-md-3">
                    <Card>
                        <Card.Header>Scanned Items</Card.Header>
                        <ListGroup variant="flush">
                            {scannedItems.map((item, index) => (
                                <ListGroup.Item key={index}>{item}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PosScanner;
