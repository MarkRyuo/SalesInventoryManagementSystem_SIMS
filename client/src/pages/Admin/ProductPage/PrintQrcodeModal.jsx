import { Modal, Button } from 'react-bootstrap';

const PrintQrcodesModal = ({ selectedQrcodes, handlePrint }) => {
    return (
        <Modal show={selectedQrcodes.length > 0} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Print QR Codes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedQrcodes.length === 0 ? (
                    <p>No QR codes selected for printing.</p>
                ) : (
                    <div>
                        {selectedQrcodes.map((qr, index) => (
                            <div key={index}>
                                <img
                                    src={qr.qrcodeBase64}
                                    alt="QR Code"
                                    style={{ width: '100px', height: '100px' }}
                                />
                                <p>Product Name: {qr.productName || 'Not Set'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { }}>
                    Close
                </Button>
                <Button variant="primary" onClick={handlePrint}>
                    Print
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PrintQrcodesModal;
