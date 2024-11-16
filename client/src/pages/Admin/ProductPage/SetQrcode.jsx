import { useState, useEffect } from 'react';
import { Button, Spinner, Modal, ListGroup, Form, Card} from 'react-bootstrap';
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProductName, setCurrentProductName] = useState('');
    const [currentQrId, setCurrentQrId] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const closePrintModal = () => setShowPrintModal(false);
    const closeEditModal = () => setShowEditModal(false);

    useEffect(() => {
        // Function to fetch QR codes and product names
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

        // Set an interval to re-fetch data every 5 seconds
        const intervalId = setInterval(fetchQrCodesAndProducts, 5000); // 5 seconds interval

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
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

        // Save the generated PDF
        doc.save('qr-codes.pdf');

        // After printing, clear the selected QR codes
        setSelectedQrcodes([]);
        setShowPrintModal(false); // Close the print modal
    };

    const sortedQrCodes = [
        ...qrCodes.filter(qr => !productNames[qr.id]),
        ...qrCodes.filter(qr => productNames[qr.id]),
    ];

    const handleOpenEditModal = (qrId) => {
        setCurrentQrId(qrId);
        setCurrentProductName(productNames[qrId] || '');
        setShowEditModal(true);
    };

    const handleSaveProductNameInModal = async () => {
        const productName = currentProductName;

        if (!productName) {
            alert('Please enter a product name.');
            return;
        }

        try {
            await saveProductName(currentQrId, productName);
            // Immediately update state without re-fetching
            setProductNames(prevState => ({
                ...prevState,
                [currentQrId]: productName,
            }));
            setSavedProductNames(prevState => ({
                ...prevState,
                [currentQrId]: productName,
            }));
            setShowEditModal(false);
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
                    View Selected QrCodes
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
                    <div className="" style={{border: '1px solid', padding: "10px", height: "500px", overflow: "auto"}}>
                        {sortedQrCodes.map((qr, index) => {
                            const isSaved = Boolean(savedProductNames[qr.id]);
                            const productName = productNames[qr.id] || '';
                            const isSelected = selectedQrcodes.some((selectedQr) => selectedQr.id === qr.id);

                            return (
                                <div key={qr.id} style={{border: '1px solid', padding: "10px"}}>
                                    <div>
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <Card.Title>QR Code #{index + 1}</Card.Title>
                                            <Card.Img
                                                variant="top"
                                                src={qr.qrcodeBase64}
                                                alt="QR Code"
                                                style={{ width: '100px', height: 'auto' }}
                                            />
                                            <Card.Text>
                                                {isSaved ? (
                                                    <span>{productName}</span>
                                                ) : (
                                                    <Button variant="link" onClick={() => handleOpenEditModal(qr.id)}>
                                                        Add Product Name
                                                    </Button>
                                                )}
                                            </Card.Text>
                                            <Button
                                                variant={isSelected ? "danger" : "info"}
                                                onClick={() => handleToggleSelection(qr)}
                                                style={{ marginTop: '8px' }}
                                            >
                                                {isSelected ? 'Remove from Print' : 'Add to Print'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
                        Print QR Codes as PDF
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
