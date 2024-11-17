import { useState, useEffect } from 'react';
import { Button, Spinner, Modal, ListGroup, Form, Card } from 'react-bootstrap';
import AddQrcode from './AddQrcode';  // If you are still using this
import { fetchQrcodesFromDatabase, saveProductName } from '../../../services/ProductService';
import { jsPDF } from 'jspdf';
import SetQrcodescss from './SCSS/Sets.module.scss';
import { MdOutlineQrCode2 } from "react-icons/md";
import { FaEye } from "react-icons/fa";

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
            <div className={SetQrcodescss.SetQrcodeBtn}>
                <Button variant="success" onClick={openModal}>
                    <MdOutlineQrCode2 size={20} className="me-1"/> Generate QR Code
                </Button>
                <Button variant="success" onClick={handleShowPrintModal} className="ml-2">
                    <FaEye size={20} className="me-1"/>Selected QrCodes
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
                    <div className={SetQrcodescss.SetQrcodemain}>
                        {sortedQrCodes.map((qr, index) => {
                            const isSaved = Boolean(savedProductNames[qr.id]);
                            const productName = productNames[qr.id] || '';
                            const isSelected = selectedQrcodes.some((selectedQr) => selectedQr.id === qr.id);

                            return (
                                <div key={qr.id} className={SetQrcodescss.SetQrcodeContent}>
                                    <div>
                                        <h4 className='m-0 p-0'>QR Code #{index + 1}</h4>
                                        <Card.Img
                                            variant="top"
                                            src={qr.qrcodeBase64}
                                            alt="QR Code"
                                        />
                                        <p className='p-0 m-0'>
                                            {isSaved ? (
                                                <span>{productName}</span>
                                            ) : (
                                                <Button variant="link" onClick={() => handleOpenEditModal(qr.id)} className='m-0 p-0'>
                                                    Product Name
                                                </Button>
                                            )}
                                        </p>
                                        <div>
                                            <Button
                                                variant={isSelected ? "danger" : "info"}
                                                onClick={() => handleToggleSelection(qr)}
                                                style={{ marginTop: '8px' }}
                                            >
                                                {isSelected ? 'Remove Print' : 'Add Print'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


            {/* Selected QR Codes for Printing Modal */}
            <Modal show={showPrintModal} onHide={closePrintModal} size="lg" centered>
                <Modal.Header closeButton className="">
                    <Modal.Title><MdOutlineQrCode2 size={20} className="me-1" />Selected QR Codes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedQrcodes.length > 0 ? (
                        <ListGroup className="mb-3">
                            {selectedQrcodes.map((qr) => (
                                <ListGroup.Item key={qr.id} className="d-flex align-items-center">
                                    <img
                                        src={qr.qrcodeBase64}
                                        alt={`QR Code ${qr.id}`}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            objectFit: 'cover',
                                            borderRadius: '5px',
                                            border: '1px solid #ddd',
                                            marginRight: '15px',
                                        }}
                                    />
                                    <div>
                                        <span className="font-weight-bold">{qr.productName || 'No Product Name'}</span>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="text-center text-muted">No QR codes selected for printing.</p>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="outline-secondary" onClick={closePrintModal}>
                        Close
                    </Button>
                    <Button variant="success" onClick={generatePDF}>
                        Print PDF
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Product Name Modal */}
            <Modal show={showEditModal} onHide={closeEditModal} centered>
                <Modal.Header closeButton className="">
                    <Modal.Title>Edit Product Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label className="font-weight-bold">Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter new product name"
                            value={currentProductName}
                            onChange={(e) => setCurrentProductName(e.target.value)}
                            className="mb-3"
                            autoFocus
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="outline-secondary" onClick={closeEditModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveProductNameInModal}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default ViewQrCode;
