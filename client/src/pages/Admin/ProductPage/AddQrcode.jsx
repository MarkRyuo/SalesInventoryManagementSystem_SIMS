/* eslint-disable react/prop-types */
import { useRef} from 'react';
import QRCode from 'qrious';
import { Modal, Button} from 'react-bootstrap';

function AddQrcode({ onClose, show }) {
    const canvasRef = useRef(null);

    const generateQRCode = () => {
        new QRCode({
            element: canvasRef.current,
            size: 200,
        });
    };


    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>QR Code Generator</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <canvas ref={canvasRef} className="mt-3" />
                <div>
                    <Button variant="primary" onClick={generateQRCode} className="mt-3">
                        Generate QR Code
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AddQrcode;
