/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';
import QRCode from 'qrious';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { addQrcodeToDatabase, checkQrcodeExists } from '../../../services/ProductService'; // Import the database function

function AddQrcode({ onClose, show }) {
    const [isSaving, setIsSaving] = useState(false); // Track saving state
    const [error, setError] = useState(null); // Track error state
    const canvasRef = useRef(null);

    const generateQRCode = () => {
        // Generate a fixed value QR code (for example, use a product ID or a unique identifier)
        const qrcodeValue = `product-${Date.now()}`;  // Use timestamp or any unique value for QR code

        setError(null); // Clear any previous error
        new QRCode({
            element: canvasRef.current,
            value: qrcodeValue,  // Set the fixed value for the QR code
            size: 200,  // Adjust the size as needed
        });
    };

    const saveQRCode = async () => {
        setIsSaving(true); // Show saving modal
        // Get the QR code as a Base64 string from the canvas
        const qrcodeBase64 = canvasRef.current.toDataURL(); // Converts the canvas content to Base64

        // Generate a unique identifier for the QR code
        const qrcodeId = `qr-${Date.now()}`;  // Use the timestamp as a unique ID for this QR code

        try {
            // Check if the QR code already exists in the database
            const exists = await checkQrcodeExists(qrcodeBase64);
            if (exists) {
                setError("This QR code already exists!");
                setIsSaving(false); // Hide saving modal
                return;
            }

            // Save the Base64 string to the database
            await addQrcodeToDatabase(qrcodeId, qrcodeBase64);
            console.log('QR Code saved to database successfully!');
        } catch (error) {
            console.error('Error saving QR Code to database:', error);
            setError('Failed to save QR code.');
        } finally {
            setIsSaving(false); // Hide saving modal after operation is complete
        }
    };

    return (
        <>
            {/* Main Modal */}
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>QR Code Generator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>} {/* Display error if exists */}

                    {/* Display the QR code */}
                    <canvas ref={canvasRef} className="mt-3" />

                    <div>
                        <Button variant="primary" onClick={generateQRCode} className="mt-3 mx-3">
                            Generate
                        </Button>
                        <Button variant="success" onClick={saveQRCode} className="mt-3 mx-2" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    {' '}Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Loading Modal */}
            <Modal show={isSaving} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Saving QR Code...</p>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddQrcode;
