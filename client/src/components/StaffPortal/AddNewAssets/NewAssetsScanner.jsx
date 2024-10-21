import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function NewAssetsScanner() {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        const startScanner = async () => {
            try {
                const videoInputDevices = await codeReader.listVideoInputDevices();
                const firstDeviceId = videoInputDevices[0].deviceId;

                codeReader.decodeFromVideoDevice(firstDeviceId, videoRef.current, (result, err) => {
                    if (result) {
                        // Navigate to the "AddNewProduct" page with the scanned result
                        history.push({
                            pathname: '/NewAssets',
                            state: { barcode: result.text }
                        });
                    }
                    if (err) {
                        if (!(err instanceof NotFoundException)) {
                            setError(err.message);
                        }
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
    }, [history]);

    return (
        <Container className="mt-4">
            <h1 className="text-center">Scanner</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <div className="text-center">
                            {error && <Alert variant="danger">Error: {error}</Alert>}
                            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NewAssetsScanner;
