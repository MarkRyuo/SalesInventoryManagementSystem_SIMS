import { Container, Table, Button, Modal } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import QRious from 'qrious';
import { FaEye, FaDownload, FaTrash } from "react-icons/fa"; // Importing icons
import AdminTransactionScss from './AdminTransactionHistory.module.scss' ;

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
                value: `http://localhost:5173/order/${selectedOrder.id}` //! Need Function to Online
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
        <Container fluid className="m-0 p-0">
            <Container fluid="lg" className="mt-3">
                <h4>Your Saved Orders</h4>

                {/* Order Table */}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Customer Name</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderHistory.length > 0 ? (
                            orderHistory.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.customerName}</td>
                                    <td>₱{order.total.toFixed(2)}</td>
                                    <td>
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
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No saved orders</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
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
                            <Table borderless>
                                <tbody>
                                    <tr>
                                        <td><strong>Order Date:</strong></td>
                                        <td>{selectedOrder.date}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Customer Name:</strong></td>
                                        <td>{selectedOrder.customerName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Subtotal:</strong></td>
                                        <td>₱{selectedOrder.subtotal.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Tax (12%):</strong></td>
                                        <td>₱{selectedOrder.tax.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Discount:</strong></td>
                                        <td>-₱{selectedOrder.discount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Amount:</strong></td>
                                        <td><strong>₱{selectedOrder.total.toFixed(2)}</strong></td>
                                    </tr>
                                </tbody>
                            </Table>

                            <h5 className="mt-4">Items</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, index) => {
                                        const price = parseFloat(item.price);
                                        const total = price * item.quantity;
                                        return (
                                            <tr key={index}>
                                                <td>{item.productName}</td>
                                                <td>{item.quantity}</td>
                                                <td>₱{price.toFixed(2)}</td>
                                                <td>₱{total.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>

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
