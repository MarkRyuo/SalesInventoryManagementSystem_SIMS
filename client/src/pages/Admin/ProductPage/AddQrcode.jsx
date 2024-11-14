/* eslint-disable react/prop-types */
import { useRef } from 'react';
import QRCode from 'qrious';
import { Modal, Button } from 'react-bootstrap';
import { addQrcodeToDatabase } from '../../../services/ProductService'; // Import the database function

function AddQrcode({ onClose, show }) {
    const canvasRef = useRef(null);

    const generateQRCode = () => {
        new QRCode({
            element: canvasRef.current,
            size: 200,  // Adjust the size as needed
        });
    };

    const saveQRCode = async () => {
        // Get the QR code as a Base64 string from the canvas
        const qrcodeBase64 = canvasRef.current.toDataURL(); // Converts the canvas content to Base64

        // Optional: you can set a custom identifier for the QR code, e.g., from a form field or unique value
        const qrcodeId = `qr-${Date.now()}`;  // Use the timestamp as a unique ID for this QR code

        try {
            // Save the Base64 string to the database
            await addQrcodeToDatabase(qrcodeId, qrcodeBase64);
            console.log('QR Code saved to database successfully!');
        } catch (error) {
            console.error('Error saving QR Code to database:', error);
        }
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
                    <Button variant="success" onClick={saveQRCode} className="mt-3 ml-2">
                        Save QR Code
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AddQrcode;
