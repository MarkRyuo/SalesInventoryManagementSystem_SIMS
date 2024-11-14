import { useState, useEffect } from 'react';
import { Button, Table, Spinner, Modal, ListGroup } from 'react-bootstrap';
import AddQrcode from './AddQrcode';
import { fetchQrcodesFromDatabase, saveProductName } from '../../../services/ProductService';
import { jsPDF } from 'jspdf';

function ViewQrCode() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCodes, setQrCodes] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [savedProductNames, setSavedProductNames] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQrcodes, setSelectedQrcodes] = useState([]); // State to track selected QR codes for printing
    const [showPrintModal, setShowPrintModal] = useState(false); // State to control the print modal

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const closePrintModal = () => setShowPrintModal(false);

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

    const handleProductNameChange = (qrId, value) => {
        setProductNames((prevState) => ({
            ...prevState,
            [qrId]: value,
        }));
    };

    const handleSaveProductName = async (qrId) => {
        const productName = productNames[qrId];
        if (!productName) {
            alert('Please enter a product name.');
            return;
        }
        try {
            await saveProductName(qrId, productName);
            setSavedProductNames((prevState) => ({
                ...prevState,
                [qrId]: productName,
            }));
            alert('Product name saved successfully!');
        } catch (error) {
            console.error('Error saving product name:', error);
            alert('Failed to save product name.');
        }
    };

    const handleEditProductName = (qrId) => {
        setProductNames((prevState) => ({
            ...prevState,
            [qrId]: savedProductNames[qrId],
        }));
    };

    // Handle adding/removing QR codes to the list for printing
    const handleToggleSelection = (qr) => {
        setSelectedQrcodes((prev) => {
            const isSelected = prev.some((selectedQr) => selectedQr.id === qr.id);
            if (isSelected) {
                return prev.filter((selectedQr) => selectedQr.id !== qr.id); // Remove if already selected
            } else {
                return [...prev, qr]; // Add if not selected
            }
        });
    };

    // Handle showing the print modal
    const handleShowPrintModal = () => setShowPrintModal(true);

    // Generate PDF of selected QR codes
    // Generate PDF of selected QR codes
    const generatePDF = () => {
        const doc = new jsPDF();
        let yOffset = 10;

        selectedQrcodes.forEach((qr, index) => {
            // Add image
            const img = new Image();
            img.src = qr.qrcodeBase64;
            doc.addImage(img, 'PNG', 10, yOffset, 30, 30); // Position and size of the image
            yOffset += 35; // Increment position for next image

            // Use the index for serial number (e.g., QR code #1, QR code #2, etc.)
            doc.text(`QR Code #${index + 1}:`, 50, yOffset); // Add serial number
            yOffset += 10;

            // Add product name
            doc.text(qr.productName || 'No Product Name', 50, yOffset);
            yOffset += 10;

            // Add a new page if the content overflows
            if (yOffset > 270) {
                doc.addPage();
                yOffset = 10; // Reset Y position
            }
        });

        doc.save('qr-codes.pdf'); // Save the PDF
    }

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
                            {qrCodes.map((qr, index) => {
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
                                                <input
                                                    type="text"
                                                    value={productName}
                                                    onChange={(e) => handleProductNameChange(qr.id, e.target.value)}
                                                    placeholder="Enter product name"
                                                />
                                            )}
                                        </td>
                                        <td>
                                            {!isSaved ? (
                                                <Button variant="success" onClick={() => handleSaveProductName(qr.id)}>
                                                    Save
                                                </Button>
                                            ) : (
                                                <Button variant="warning" onClick={() => handleEditProductName(qr.id)}>
                                                    Edit
                                                </Button>
                                            )}
                                            <Button
                                                variant={isSelected ? "danger" : "info"} // Toggle button color
                                                onClick={() => handleToggleSelection(qr)} // Toggle QR selection
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

            {/* Modal for Viewing Selected QR Codes to Print */}
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
        </>
    );
}

export default ViewQrCode;
