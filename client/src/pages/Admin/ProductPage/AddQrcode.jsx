/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import QRCode from 'qrious';
import { Modal, Button, Form } from 'react-bootstrap';

function AddQrcode({ onClose, show }) {
    const [text, setText] = useState('');
    const canvasRef = useRef(null);

    const generateQRCode = () => {
        const qr = new QRCode({
            element: canvasRef.current,
            value: text,
            size: 200, // Adjust the size as needed
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
