import { useState, useEffect } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import AddQrcode from './AddQrcode';
import { fetchQrcodesFromDatabase, saveProductName } from '../../../services/ProductService';

function ViewQrCode() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCodes, setQrCodes] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [savedProductNames, setSavedProductNames] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Fetch QR codes and product names when the component mounts
    useEffect(() => {
        const fetchQrCodesAndProducts = async () => {
            try {
                const fetchedQrcodes = await fetchQrcodesFromDatabase(); // Fetch QR codes from DB
                setQrCodes(fetchedQrcodes);

                // Initialize product names from the fetched data
                const initialProductNames = fetchedQrcodes.reduce((acc, qr) => {
                    acc[qr.id] = qr.productName || ''; // Default to empty string if no name
                    return acc;
                }, {});

                setProductNames(initialProductNames);
                setSavedProductNames(initialProductNames); // Set saved product names
            } catch (error) {
                console.error('Error fetching QR codes or products:', error);
            } finally {
                setIsLoading(false); // Set loading state to false after data fetch
            }
        };

        fetchQrCodesAndProducts();
    }, []);


    // Handle change in product name input
    const handleProductNameChange = (qrId, value) => {
        setProductNames((prevState) => ({
            ...prevState,
            [qrId]: value,
        }));
    };

    // Save product name to the database
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

    // Enable editing of the product name
    const handleEditProductName = (qrId) => {
        setProductNames((prevState) => ({
            ...prevState,
            [qrId]: savedProductNames[qrId], // Set input value to saved product name
        }));
    };

    return (
        <>
            <div className="mb-4">
                <Button variant="primary" onClick={openModal}>
                    Generate QR Code
                </Button>
                <AddQrcode show={isModalOpen} onClose={closeModal} />
            </div>

            <div className="mb-4">
                <Button variant="primary" onClick={openModal}>
                    Print Qrcodes
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
                                {qrCodes
                                    .slice()
                                    .sort((a, b) => {
                                        // Sort: QR codes without a product name come first
                                        const hasNameA = savedProductNames[a.id] ? 1 : 0;
                                        const hasNameB = savedProductNames[b.id] ? 1 : 0;
                                        return hasNameA - hasNameB;
                                    })
                                    .map((qr, index) => {
                                        const isSaved = Boolean(savedProductNames[qr.id]);
                                        const productName = productNames[qr.id] || '';

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
                                                        <Button
                                                            variant="success"
                                                            onClick={() => handleSaveProductName(qr.id)}
                                                        >
                                                            Save
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="warning"
                                                            onClick={() => handleEditProductName(qr.id)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                    </Table>
                )}
            </div>
        </>
    );
}

export default ViewQrCode;
