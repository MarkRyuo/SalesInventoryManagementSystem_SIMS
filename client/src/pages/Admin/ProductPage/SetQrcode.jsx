import { useState, useEffect } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import AddQrcode from './AddQrcode'; // Import the modal for QR code generation
import { fetchQrcodesFromDatabase, saveProductName } from '../../../services/ProductService'; // Fetch QR codes and save product name

function ViewQrCode() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCodes, setQrCodes] = useState([]); // Store QR codes
    const [productNames, setProductNames] = useState({}); // Store product names for each QR code
    const [savedProductNames, setSavedProductNames] = useState({}); // Track saved product names
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Fetch QR codes and products when the component mounts
    useEffect(() => {
        const fetchQrCodesAndProducts = async () => {
            try {
                const fetchedQrcodes = await fetchQrcodesFromDatabase(); // Fetch QR codes from DB
                setQrCodes(fetchedQrcodes);
            } catch (error) {
                console.error('Error fetching QR codes or products:', error);
            } finally {
                setIsLoading(false); // Set loading state to false after data fetch
            }
        };

        fetchQrCodesAndProducts();
    }, []); // Run once when the component mounts

    // Handle change in product name input for each QR code
    const handleProductNameChange = (qrId, value) => {
        setProductNames((prevState) => ({
            ...prevState,
            [qrId]: value,
        }));
    };

    // Handle saving the product name for a QR code
    const handleSaveProductName = async (qrId) => {
        try {
            const productName = productNames[qrId];
            if (productName) {
                // Call the service to save the product name
                await saveProductName(qrId, productName); // Assuming this function saves the data to the backend
                setSavedProductNames((prevState) => ({
                    ...prevState,
                    [qrId]: productName,
                }));
                alert('Product name saved successfully!');
            } else {
                alert('Please enter a product name.');
            }
        } catch (error) {
            console.error('Error saving product name:', error);
            alert('Error saving product name.');
        }
    };

    // Handle editing the product name
    const handleEditProductName = (qrId) => {
        setProductNames((prevState) => ({
            ...prevState,
            [qrId]: savedProductNames[qrId], // Restore the saved product name for editing
        }));
        setSavedProductNames((prevState) => ({
            ...prevState,
            [qrId]: "", // Clear the saved state to enable editing again
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

            <div className="mt-4">
                {/* Loading Spinner */}
                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading QR Codes...</p>
                    </div>
                ) : (
                    // Table displaying QR codes
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>QR Code</th>
                                <th>Add Product Name</th> {/* Displaying product name */}
                                <th>Actions</th> {/* Save/Edit button */}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Reverse the array to show the newest QR codes first */}
                            {qrCodes.slice().reverse().map((qr, index) => {
                                const isSaved = savedProductNames[qr.id]; // Check if the product name is saved

                                return (
                                    <tr key={qr.id}>
                                        <td>{index + 1}</td>
                                        <td>{qr.id}</td>
                                        <td>
                                            <img
                                                src={qr.qrcodeBase64}
                                                alt="QR Code"
                                                style={{ width: '100px', height: '100px' }} // Size for QR code
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={productNames[qr.id] || ''}
                                                onChange={(e) => handleProductNameChange(qr.id, e.target.value)}
                                                placeholder="Enter product name"
                                                disabled={isSaved} // Disable input if the product name is saved
                                            />
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
