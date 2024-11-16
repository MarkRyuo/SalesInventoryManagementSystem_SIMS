import { Container, Button, Modal, ListGroup } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import QRious from 'qrious';
import { FaEye, FaDownload, FaTrash } from "react-icons/fa"; // Importing icons
import AdminTransactionScss from './AdminTransactionHistory.module.scss';

function AdminTransactionHistory() {
    const [orderHistory, setOrderHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const db = getDatabase();
    const qrRef = useRef(null);

    useEffect(() => {
        const historyRef = ref(db, 'TransactionHistory/');
        onValue(historyRef, (snapshot) => {
            const data = snapshot.val() || {};
            const formattedHistory = Object.entries(data).map(([key, value]) => ({
                ...value,
                id: key,
                subtotal: parseFloat(value.subtotal) || 0,
                tax: parseFloat(value.tax) || 0,
                discount: parseFloat(value.discount) || 0,
                total: parseFloat(value.total) || 0,
                items: value.items.map(item => ({
                    ...item,
                    price: parseFloat(item.price) || 0
                }))
            }));
            setOrderHistory(formattedHistory);
        });
    }, [db]);

    useEffect(() => {
        if (selectedOrder && qrRef.current) {
            new QRious({
                element: qrRef.current,
                value: `https://salesinventorymanagement-1bb27.web.app/ProductPage/${selectedOrder.id}` //! Need Function to Online
            });
        }
    }, [selectedOrder]);

    const handleDownloadOrder = async (order) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Receipt', 105, 10, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Order Date: ${order.date}`, 10, 30);
        doc.text(`Sold To: ${order.customerName}`, 10, 40);
        doc.text(`Subtotal: ₱${order.subtotal.toFixed(2)}`, 10, 50);
        doc.text(`Tax (12%): ₱${order.tax.toFixed(2)}`, 10, 60);
        doc.text(`Discount: -₱${order.discount.toFixed(2)}`, 10, 70);
        doc.text(`Total Amount: ₱${order.total.toFixed(2)}`, 10, 80);

        const qrCanvas = qrRef.current;
        if (qrCanvas) {
            const qrDataUrl = qrCanvas.toDataURL("image/png");
            doc.addImage(qrDataUrl, 'PNG', 10, 90, 50, 50);
        }

        doc.save(`Order_${order.id}.pdf`);
    };

    const handleDeleteOrder = (id) => {
        const orderRef = ref(db, `TransactionHistory/${id}`);
        remove(orderRef);
        setShowDeleteModal(false); // Close the delete confirmation modal after deleting
    };

    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    // Show the delete confirmation modal
    const handleShowDeleteModal = (order) => {
        setSelectedOrder(order);
        setShowDeleteModal(true);
    };

    // Close the delete confirmation modal without deleting
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedOrder(null);
    };

    // Get a list of product names for the warning message
    const getProductNames = (order) => {
        return order.items.map(item => item.productName).join(", ");
    };

    return (
        <Container fluid className={AdminTransactionScss.transactionMainContainer}>
            <h4>Your Saved Orders</h4>
            <div>
                
            </div>
            <Container fluid="lg" className={AdminTransactionScss.transactionchildContainer} >

                {/* Mapped Order List */}
                <ListGroup variant="flush">
                    {orderHistory.length > 0 ? (
                        orderHistory.map((order) => (
                            <ListGroup.Item key={order.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>Order ID: {order.id}</h5>
                                    <p>Order Date: {order.date}</p>
                                    <p>Customer Name: {order.customerName}</p>
                                    <p>Total: ₱{order.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <Button
                                        variant="outline-info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowModal(order)}
                                    >
                                        <FaEye />
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleDownloadOrder(order)}
                                    >
                                        <FaDownload />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleShowDeleteModal(order)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item className="text-center">No saved orders</ListGroup.Item>
                    )}
                </ListGroup>
            </Container>

            {/* Updated Modal for viewing order details */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <Container>
                            <h5 className="mb-3">Order Summary</h5>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Order Date:</strong> {selectedOrder.date}</ListGroup.Item>
                                <ListGroup.Item><strong>Customer Name:</strong> {selectedOrder.customerName}</ListGroup.Item>
                                <ListGroup.Item><strong>Subtotal:</strong> ₱{selectedOrder.subtotal.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Tax (12%):</strong> ₱{selectedOrder.tax.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Discount:</strong> -₱{selectedOrder.discount.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Total Amount:</strong> <strong>₱{selectedOrder.total.toFixed(2)}</strong></ListGroup.Item>
                            </ListGroup>

                            <h5 className="mt-4">Items</h5>
                            <ListGroup variant="flush">
                                {selectedOrder.items.map((item, index) => {
                                    const price = parseFloat(item.price);
                                    const total = price * item.quantity;
                                    return (
                                        <ListGroup.Item key={index}>
                                            <p><strong>Product:</strong> {item.productName}</p>
                                            <p><strong>Quantity:</strong> {item.quantity}</p>
                                            <p><strong>Unit Price:</strong> ₱{price.toFixed(2)}</p>
                                            <p><strong>Total:</strong> ₱{total.toFixed(2)}</p>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>

                            <h5 className="mt-4">Download Receipt QR Code</h5>
                            <div className="d-flex justify-content-center">
                                <canvas ref={qrRef} style={{ maxWidth: "100%", height: "auto" }} />
                            </div>
                        </Container>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-danger">
                        Warning: Deleting the following products is permanent and cannot be undone:
                    </p>
                    <p><strong>{selectedOrder ? getProductNames(selectedOrder) : ''}</strong></p>
                    <p>Are you sure you want to delete this order?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleDeleteOrder(selectedOrder.id)}>Delete</Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default AdminTransactionHistory;
