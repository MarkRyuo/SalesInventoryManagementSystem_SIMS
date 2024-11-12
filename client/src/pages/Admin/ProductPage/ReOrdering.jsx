import { useEffect, useState } from "react";
import { fetchReorderingProducts } from "../../../services/ProductService";
import { Table, Spinner, Button, Badge, Container, Modal } from "react-bootstrap";
import { jsPDF } from "jspdf";

function ReOrdering() {
    const [reorderingProducts, setReorderingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showReorderModal, setShowReorderModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reorderList, setReorderList] = useState([]);
    const [reorderedProducts, setReorderedProducts] = useState(new Set());

    const POLL_INTERVAL = 10000; // Every 10 seconds

    const fetchData = async () => {
        try {
            const products = await fetchReorderingProducts();
            setReorderingProducts(products);
        } catch (error) {
            console.error("Error fetching reordering products:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData().then(() => setLoading(false));

        const intervalId = setInterval(fetchData, POLL_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    // Open Product Modal
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    // Add product to the reorder list and track reordered products
    const handleReorderProduct = (product) => {
        setReorderList((prevList) => {
            if (!prevList.find((item) => item.barcode === product.barcode)) {
                return [...prevList, product];
            }
            return prevList;
        });

        // Mark product as reordered
        setReorderedProducts((prevSet) => new Set(prevSet).add(product.barcode));

        // Remove the product from the reorderingProducts list
        setReorderingProducts((prevProducts) =>
            prevProducts.filter((item) => item.barcode !== product.barcode)
        );

        setShowProductModal(false);
    };

    // Open Reorder List Modal
    const handleOpenReorderModal = () => {
        setShowReorderModal(true);
    };

    // Close Modals
    const handleCloseModals = () => {
        setShowProductModal(false);
        setShowReorderModal(false);
    };

    // Download Order List as PDF
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Reorder List", 10, 10);
        reorderList.forEach((product, index) => {
            doc.text(`${index + 1}. ${product.productName} - SKU: ${product.sku} - Quantity: ${product.quantity}`, 10, 20 + index * 10);
        });
        doc.save("Reorder_List.pdf");
    };

    return (
        <Container>
            <h4 className="my-4">Reordering Dashboard</h4>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <>
                    {reorderingProducts.length > 0 ? (
                        <Table responsive bordered hover className="mt-3">
                            <thead className="table-primary">
                                <tr>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reorderingProducts.map((product) => {
                                    const isOutOfStock = product.quantity === 0;
                                    const isLowStock = product.quantity > 0 && product.quantity <= product.instockthreshold / 4;
                                    
                                    const statusBadge = isOutOfStock ? (
                                        <Badge bg="danger">Out of Stock</Badge>
                                    ) : (
                                        isLowStock && <Badge bg="warning">Low Stock</Badge>
                                    );

                                    if (!isOutOfStock && !isLowStock) return null;

                                    const isReordered = reorderedProducts.has(product.barcode);

                                    return (
                                        <tr key={product.barcode}>
                                            <td>{product.productName}</td>
                                            <td>{product.sku}</td>
                                            <td>{product.category}</td>
                                            <td>{product.quantity}</td>
                                            <td>{statusBadge}</td>
                                            <td>
                                                {!isReordered ? (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleViewProduct(product)}
                                                    >
                                                        Reorder
                                                    </Button>
                                                ) : (
                                                    <Badge bg="secondary">Reordered</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-muted">No products need reordering.</p>
                    )}
                    <Button variant="primary" onClick={handleOpenReorderModal} className="mt-3">
                        View Reorder List
                    </Button>
                </>
            )}

            {/* Product Details Modal */}
            <Modal show={showProductModal} onHide={handleCloseModals}>
                <Modal.Header closeButton>
                    <Modal.Title>Product Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <div>
                            <p><strong>Name:</strong> {selectedProduct.productName}</p>
                            <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                            <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Close
                    </Button>
                    <Button variant="success" onClick={() => handleReorderProduct(selectedProduct)}>
                        Add to Reorder List
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Reorder List Modal */}
            <Modal show={showReorderModal} onHide={handleCloseModals}>
                <Modal.Header closeButton>
                    <Modal.Title>Reorder List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {reorderList.length > 0 ? (
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reorderList.map((product) => (
                                    <tr key={product.barcode}>
                                        <td>{product.productName}</td>
                                        <td>{product.sku}</td>
                                        <td>{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No products added to reorder list.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDownloadPDF}>
                        Download PDF
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ReOrdering;
