import { useState, useEffect } from 'react';
import { Button, Table, Spinner, Modal, ListGroup, Form } from 'react-bootstrap';
import AddQrcode from './AddQrcode';  // If you are still using this
import { fetchQrcodesFromDatabase, saveProductName } from '../../../services/ProductService';
import { jsPDF } from 'jspdf';

function ViewQrCode() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCodes, setQrCodes] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [savedProductNames, setSavedProductNames] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQrcodes, setSelectedQrcodes] = useState([]);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);  // State for product name input modal
    const [currentProductName, setCurrentProductName] = useState('');  // State for the current product name to be edited
    const [currentQrId, setCurrentQrId] = useState(null);  // State to track the QR code being edited

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const closePrintModal = () => setShowPrintModal(false);
    const closeEditModal = () => setShowEditModal(false);  // Close the edit modal

    useEffect(() => {
        const fetchQrCodesAndProducts = async () => {
            try {
                const fetchedQrcodes = await fetchQrcodesFromDatabase();
                setQrCodes(fetchedQrcodes);
                const initialProductNames = fetchedQrcodes.reduce((acc, qr) => {
                    acc[qr.id] = qr.productName || '';
                    return acc;
                }, {});
                setProductNames(initialProductNames);
                setSavedProductNames(initialProductNames);
            } catch (error) {
                console.error('Error fetching QR codes or products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQrCodesAndProducts();
    }, []);

    const handleToggleSelection = (qr) => {
        setSelectedQrcodes((prev) => {
            const isSelected = prev.some((selectedQr) => selectedQr.id === qr.id);
            if (isSelected) {
                return prev.filter((selectedQr) => selectedQr.id !== qr.id);
            } else {
                return [...prev, qr];
            }
        });
    };

    const handleShowPrintModal = () => setShowPrintModal(true);

    const generatePDF = () => {
        const doc = new jsPDF();
        let yOffset = 10;

        selectedQrcodes.forEach((qr, index) => {
            const img = new Image();
            img.src = qr.qrcodeBase64;
            doc.addImage(img, 'PNG', 10, yOffset, 30, 30);
            yOffset += 35;

            doc.text(`QR Code #${index + 1}:`, 50, yOffset);
            yOffset += 10;

            doc.text(qr.productName || 'No Product Name', 50, yOffset);
            yOffset += 10;

            if (yOffset > 270) {
                doc.addPage();
                yOffset = 10;
            }
        });

        doc.save('qr-codes.pdf');
    };

    // Sorting QR codes
    const sortedQrCodes = [
        ...qrCodes.filter(qr => !productNames[qr.id]),
        ...qrCodes.filter(qr => productNames[qr.id]),
    ];

    const handleOpenEditModal = (qrId) => {
        setCurrentQrId(qrId);
        setCurrentProductName(productNames[qrId] || '');
        setShowEditModal(true); // Open the edit modal
    };

    const handleSaveProductNameInModal = async () => {
        const productName = currentProductName;

        if (!productName) {
            alert('Please enter a product name.');
            return;
        }

        try {
            await saveProductName(currentQrId, productName);
            setSavedProductNames((prevState) => ({
                ...prevState,
                [currentQrId]: productName,
            }));
            setShowEditModal(false); // Close the modal after saving
            alert('Product name saved successfully!');
        } catch (error) {
            console.error('Error saving product name:', error);
            alert('Failed to save product name.');
        }
    };

    return (
        <>
            <div className="mb-4">
                <Button variant="primary" onClick={openModal}>
                    Generate QR Code
                </Button>
                <Button variant="secondary" onClick={handleShowPrintModal} className="ml-2">
                    View Selected QR Codes for Printing
                </Button>
                <AddQrcode show={isModalOpen} onClose={closeModal} />
            </div>

            <div className="mt-4">
                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading QR Codes...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>QR Code</th>
                                <th>Product Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedQrCodes.map((qr, index) => {
                                const isSaved = Boolean(savedProductNames[qr.id]);
                                const productName = productNames[qr.id] || '';
                                const isSelected = selectedQrcodes.some((selectedQr) => selectedQr.id === qr.id);

                                return (
                                    <tr key={qr.id}>
                                        <td>{index + 1}</td>
                                        <td>{qr.id}</td>
                                        <td>
                                            <img
                                                src={qr.qrcodeBase64}
                                                alt="QR Code"
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        </td>
                                        <td>
                                            {isSaved ? (
                                                <span>{productName}</span>
                                            ) : (
                                                <Button variant="link" onClick={() => handleOpenEditModal(qr.id)}>
                                                    Edit
                                                </Button>
                                            )}
                                        </td>
                                        <td>
                                            <Button
                                                variant={isSelected ? "danger" : "info"}
                                                onClick={() => handleToggleSelection(qr)}
                                                style={{ marginLeft: '8px' }}
                                            >
                                                {isSelected ? 'Remove from Print' : 'Add to Print'}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showPrintModal} onHide={closePrintModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Selected QR Codes for Printing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {selectedQrcodes.length > 0 ? (
                            selectedQrcodes.map((qr) => (
                                <ListGroup.Item key={qr.id}>
                                    <img
                                        src={qr.qrcodeBase64}
                                        alt={`QR Code ${qr.id}`}
                                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                    />
                                    {qr.productName || 'No Product Name'}
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No QR codes selected for printing.</p>
                        )}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closePrintModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={generatePDF}>
                        Print Selected QR Codes as PDF
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Editing Product Name */}
            <Modal show={showEditModal} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={currentProductName}
                            onChange={(e) => setCurrentProductName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveProductNameInModal}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewQrCode;
