import { useState, useEffect } from 'react';
import AddQrcode from "./AddQrcode";
import { Container, Table, Spinner, Alert, Image, Button } from 'react-bootstrap';
import { fetchProductsWithQRCodes } from '../../../services/ProductService';

function ProductListWithQRCodes() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch products on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');

            try {
                const productList = await fetchProductsWithQRCodes();
                setProducts(productList);
            } catch (err) {
                setError(`Error fetching products: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const [showModal, setShowModal] = useState(false);

    // Handle opening the modal
    const handleShowModal = () => setShowModal(true);

    // Handle closing the modal
    const handleCloseModal = () => setShowModal(false);

    return (
        <Container fluid="lg">
            <h3>Product List with QR Codes</h3>
            <div>
                <Button variant="primary" onClick={handleShowModal}>
                    Set QR Code for Product
                </Button>
                <AddQrcode
                    showModal={showModal}
                    handleCloseModal={handleCloseModal}
                />
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {isLoading && <Spinner animation="border" className="mx-auto d-block" />}

            {!isLoading && products.length === 0 && (
                <Alert variant="info">No products found with QR codes.</Alert>
            )}

            {!isLoading && products.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.productName}</td>
                                <td>{product.sku}</td>
                                <td>{product.category}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price}</td>
                                <td>
                                    {product.qrCodeData ? (
                                        <Image
                                            src={product.qrCodeData}
                                            alt="QR Code"
                                            style={{ width: '100px', height: '100px' }}
                                            fluid
                                        />
                                    ) : (
                                        'No QR Code'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default ProductListWithQRCodes;
