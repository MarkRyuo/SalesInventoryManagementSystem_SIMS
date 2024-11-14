import { useState, useEffect } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import AddQrcode from './AddQrcode';
import { fetchQrcodesFromDatabase } from '../../../services/ProductService'; // Import the function to fetch QR codes
import { fetchProductsFromDatabase } from '../../../services/ProductService'; // Import the function to fetch products

function ViewQrCode() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCodes, setQrCodes] = useState([]); // Store the fetched QR codes
    const [products, setProducts] = useState([]); // Store the fetched products
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
                const fetchedProducts = await fetchProductsFromDatabase(); // Fetch products from DB

                // If the fetchedProducts is an object, convert it to an array using Object.values()
                setQrCodes(fetchedQrcodes); // Set fetched QR codes to state
                setProducts(Object.values(fetchedProducts)); // Convert products object to array and set it to state
            } catch (error) {
                console.error('Error fetching QR codes or products:', error);
            } finally {
                setIsLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchQrCodesAndProducts();
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
                                <th>Product Name</th> {/* Display product name */}
                            </tr>
                        </thead>
                        <tbody>
                            {qrCodes.map((qr) => {
                                // Match QR code with product
                                const matchedProduct = products.find(
                                    (product) => product.qrcodeId === qr.id // Assuming qrcodeId matches product QR code ID
                                );

                                return (
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
                                            {matchedProduct ? matchedProduct.productName : 'No product found'}
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
