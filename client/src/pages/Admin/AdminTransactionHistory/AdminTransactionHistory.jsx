import { Container, Table, Button, Modal } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import QRious from 'qrious';
import { FaEye, FaDownload, FaTrash } from "react-icons/fa"; // Importing icons

function AdminTransactionHistory() {
    const [orderHistory, setOrderHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
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
                value: `http://localhost:5173/order/${selectedOrder.id}`
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
    };

    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
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
                                            onClick={() => handleDeleteOrder(order.id)}
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

            {/* Modal for viewing order details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <h5>Order Date: {selectedOrder.date}</h5>
                            <h6>Sold To: {selectedOrder.customerName}</h6>
                            <h6>Subtotal: ₱{selectedOrder.subtotal.toFixed(2)}</h6>
                            <h6>Tax (12%): ₱{selectedOrder.tax.toFixed(2)}</h6>
                            <h6>Discount: -₱{selectedOrder.discount.toFixed(2)}</h6>
                            <h6>Total Amount: ₱{selectedOrder.total.toFixed(2)}</h6>
                            <h6>Items:</h6>
                            <ul>
                                {selectedOrder.items.map((item, index) => {
                                    const price = parseFloat(item.price);
                                    const total = price * item.quantity;
                                    return (
                                        <li key={index}>
                                            {item.productName} - Qty: {item.quantity}, Unit Price: ₱{price.toFixed(2)}, Total: ₱{total.toFixed(2)}
                                        </li>
                                    );
                                })}
                            </ul>
                            <h6>Download Receipt QR Code:</h6>
                            <canvas ref={qrRef} />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminTransactionHistory;
