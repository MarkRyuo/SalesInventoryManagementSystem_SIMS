import { useState, useEffect } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import AddQrcode from './AddQrcode';
import { fetchQrcodesFromDatabase } from '../../../services/ProductService'; // Import the database function

function ViewQrCode() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCodes, setQrCodes] = useState([]); // Store the fetched QR codes
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Fetch QR codes when the component mounts
    useEffect(() => {
        const fetchQrCodes = async () => {
            try {
                const fetchedQrcodes = await fetchQrcodesFromDatabase(); // Function to fetch QR codes from DB
                setQrCodes(fetchedQrcodes); // Set fetched QR codes to state
            } catch (error) {
                console.error('Error fetching QR codes:', error);
            } finally {
                setIsLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchQrCodes();
    }, []); // Empty dependency array means it will run only once when the component mounts

    return (
        <>
            <div className="mb-4">
                <Button variant="primary" onClick={openModal}>
                    Generate QR Code
                </Button>
                <AddQrcode show={isModalOpen} onClose={closeModal} />
            </div>

            <div className="mt-4">
                {/* Display Loading Spinner while fetching data */}
                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading QR Codes...</p>
                    </div>
                ) : (
                    // Display QR codes in a Table
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>QR Code</th>
                                <th>Product Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qrCodes.map((qr) => (
                                <tr key={qr.id}>
                                    <td>{qr.id}</td>
                                    <td>
                                        <img
                                            src={qr.qrcodeBase64}
                                            alt="QR Code"
                                            style={{ width: '100px', height: '100px' }} // Adjust the size of the QR code image
                                        />
                                    </td>
                                    <td>
                                        {/* if the qrcode 
                                                check the products if qrcode exist display the Product name
                                         */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </>
    );
}

export default ViewQrCode;
