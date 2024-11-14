import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const PrintQrcodesModal = () => {
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <div className="mb-4">
            <Button variant="primary" onClick={handleShow}>
                Print Qrcodes
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Print QR Codes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Add any content or instructions for printing QR codes here */}
                    Are you sure you want to print the QR codes?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => { /* Add print functionality here */ }}>
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PrintQrcodesModal;
