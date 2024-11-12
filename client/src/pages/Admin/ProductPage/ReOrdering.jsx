import { useEffect, useState } from "react";
import { fetchReorderingProducts } from "../../../services/ProductService";
import { Table, Spinner, Button, Badge, Container, Modal, Form } from "react-bootstrap";
import { jsPDF } from "jspdf";

function ReOrdering() {
    const [reorderingProducts, setReorderingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orderList, setOrderList] = useState([]);

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

    // Open Modal and add product to the order list
    const handleReorder = (product) => {
        setOrderList((prevList) => {
            if (!prevList.find((item) => item.barcode === product.barcode)) {
                return [...prevList, product];
            }
            return prevList;
        });
        setShowModal(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setShowModal(false);
        setOrderList([]);
    };

    // Download Order List as PDF
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Reorder List", 10, 10);
        orderList.forEach((product, index) => {
            doc.text(`${index + 1}. ${product.productName} - Quantity: ${product.quantity}`, 10, 20 + index * 10);
        });
        doc.save("Reorder_List.pdf");
    };

    return (
        <Container>
            <h4 className="my-4">Reordering Dashboard</h4>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <div>
                    {reorderingProducts.length > 0 ? (
                        <>
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
                                        const isLowStock =
                                            product.quantity > 0 &&
                                            product.quantity <= product.instockthreshold / 4;

                                        const statusBadge = isOutOfStock ? (
                                            <Badge bg="danger">Out of Stock</Badge>
                                        ) : (
                                            isLowStock && <Badge bg="warning">Low Stock</Badge>
                                        );

                                        if (!isOutOfStock && !isLowStock) return null;

                                        return (
                                            <tr key={product.barcode}>
                                                <td>{product.productName}</td>
                                                <td>{product.sku}</td>
                                                <td>{product.category}</td>
                                                <td>{product.quantity}</td>
                                                <td>{statusBadge}</td>
                                                <td>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => handleReorder(product)}
                                                    >
                                                        Reorder
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </>
                    ) : (
                        <p className="text-muted">No products need reordering.</p>
                    )}
                </div>
            )}

            {/* Reorder Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Reorder Products</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {orderList.length > 0 ? (
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderList.map((product) => (
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
                    <Button variant="secondary" onClick={handleCloseModal}>
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
