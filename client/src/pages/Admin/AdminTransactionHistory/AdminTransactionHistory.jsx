import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import QRious from 'qrious';
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function AdminTransactionHistory() {
    const [orderHistory, setOrderHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const db = getDatabase();
    const qrRef = useRef(null); // Ref for the QR code canvas

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
                    price: parseFloat(item.price) || 0 // Convert price to number
                }))
            }));
            setOrderHistory(formattedHistory);
        });
    }, [db]);

    useEffect(() => {
        if (selectedOrder && qrRef.current) {
            new QRious({
                element: qrRef.current,
                value: `http://localhost:5173/order/${selectedOrder.id}` // Adjust this URL based on your routing
            });
        }
    }, [selectedOrder]); // Re-generate QR code when selectedOrder changes

    const handleDownloadOrder = async (order) => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Receipt', 105, 10, { align: 'center' });

        // Order details
        doc.setFontSize(12);
        doc.text(`Order Date: ${order.date}`, 10, 30);
        doc.text(`Sold To: ${order.customerName}`, 10, 40);
        doc.text(`Subtotal: ₱${order.subtotal.toFixed(2)}`, 10, 50);
        doc.text(`Tax (12%): ₱${order.tax.toFixed(2)}`, 10, 60);
        doc.text(`Discount: -₱${order.discount.toFixed(2)}`, 10, 70);
        doc.text(`Total Amount: ₱${order.total.toFixed(2)}`, 10, 80);

        // Adding a line
        doc.line(10, 85, 200, 85);

        // Table header
        doc.setFontSize(14);
        doc.text('Product Description', 10, 90);
        doc.text('Quantity', 140, 90);
        doc.text('Unit Price', 160, 90);
        doc.text('Amount', 180, 90);
        doc.line(10, 92, 200, 92);

        // Adding items to the receipt
        order.items.forEach((item, index) => {
            const yPosition = 100 + (index * 10);
            const description = `${item.productName}, Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}, Voltage: ${item.voltage || 'N/A'}, Watt: ${item.watt || 'N/A'}`;
            doc.text(description, 10, yPosition);
            doc.text(item.quantity.toString(), 140, yPosition);
            const price = parseFloat(item.price);
            const amount = price * item.quantity;
            doc.text(`₱${!isNaN(price) ? price.toFixed(2) : '0.00'}`, 160, yPosition);
            doc.text(`₱${!isNaN(amount) ? amount.toFixed(2) : '0.00'}`, 180, yPosition);
        });

        // QR Code handling
        const qrCanvas = qrRef.current;
        if (qrCanvas) {
            const qrDataUrl = qrCanvas.toDataURL("image/png");
            doc.addImage(qrDataUrl, 'PNG', 10, 110 + (order.items.length * 10), 50, 50); // Adjust position and size as needed
        }

        // Save the PDF
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
            <Container fluid='lg' className="mt-3">
                <Row>
                    <Col>
                        <h4>Your Saved Orders</h4>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderHistory.length > 0 ? (
                                    orderHistory.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.date}</td>
                                            <td>₱{order.total.toFixed(2)}</td>
                                            <td>
                                                <Button variant="info" onClick={() => handleShowModal(order)}>View</Button>
                                                <Button variant="primary" onClick={() => handleDownloadOrder(order)}>Download</Button>
                                                <Button variant="danger" className="ms-2" onClick={() => handleDeleteOrder(order.id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">No saved orders</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
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
                                            {item.productName}, Size: {item.size || 'N/A'}, Color: {item.color || 'N/A'}, Voltage: {item.voltage || 'N/A'}, Watt: {item.watt || 'N/A'} - Quantity: {item.quantity}, Unit Price: ₱{!isNaN(price) ? price.toFixed(2) : 'N/A'}, Total: ₱{!isNaN(total) ? total.toFixed(2) : 'N/A'}
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
