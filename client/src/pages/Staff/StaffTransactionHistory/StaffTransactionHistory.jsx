import { Container, Button, Modal, ListGroup, Row, Col, Form } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import { getDatabase, ref, onValue } from 'firebase/database';
import QRious from 'qrious';
import { FaEye, FaDownload} from "react-icons/fa";
import StaffTransactionScss from './StaffTransactionHistory.module.scss' ;
import { FaSave } from "react-icons/fa";
import { FaTruckRampBox } from "react-icons/fa6";

function AdminTransactionHistory() {
    const [orderHistory, setOrderHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const db = getDatabase();
    const qrRef = useRef(null);
    const [filterDate, setFilterDate] = useState('');
    const [filterCustomer, setFilterCustomer] = useState('');

    useEffect(() => {
        const historyRef = ref(db, 'TransactionHistory/');
        const unsubscribe = onValue(historyRef, (snapshot) => {
            const data = snapshot.val() || {};
            const formattedHistory = Object.entries(data).map(([key, value]) => ({
                ...value,
                id: key,
                subtotal: parseFloat(value.subtotal) || 0,
                tax: parseFloat(value.tax) || 0,
                discount: parseFloat(value.discount) || 0,
                total: parseFloat(value.total) || 0,
                date: value.date ? new Date(value.date).toLocaleDateString() : 'N/A',
                items: value.items.map(item => ({
                    ...item,
                    price: parseFloat(item.price) || 0
                }))
            }));
            // Sort orders by date in descending order
            formattedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrderHistory(formattedHistory);
        });

        return () => unsubscribe(); // Cleanup listener
    }, [db]);

    const filteredOrders = orderHistory.filter(order => {
        const orderDate = order.date;
        const parsedFilterDate = filterDate ? new Date(filterDate).toLocaleDateString() : '';

        return (
            (filterDate ? orderDate.includes(parsedFilterDate) : true) &&
            (filterCustomer ? order.customerName.toLowerCase().includes(filterCustomer.toLowerCase()) : true)
        );
    });

    useEffect(() => {
        if (selectedOrder && qrRef.current) {
            new QRious({
                element: qrRef.current,
                value: `https://us-central1-your-project-id.cloudfunctions.net/api/downloadOrder?id=${selectedOrder.id}`, // Updated to Firebase Function URL
                size: 256,
            });

        }
    }, [selectedOrder]);
    
    const handleDownloadOrder = async (order) => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Receipt', 105, 20, { align: 'center' });

        // Order details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Order Date: ${order.date}`, 10, 40);
        doc.text(`Sold To: ${order.customerName}`, 10, 50);
        doc.text(`Order ID: ${order.id}`, 10, 60);

        // Pricing Breakdown
        doc.text(`Subtotal: \u20B1${order.subtotal.toFixed(2)}`, 10, 70);
        doc.text(`Tax (12%): \u20B1${order.tax.toFixed(2)}`, 10, 80);
        doc.text(`Discount: -\u20B1${order.discount.toFixed(2)}`, 10, 90);
        doc.text(`Payment Amount: \u20B1${parseFloat(order.paymentAmount).toFixed(2)}`, 10, 100); // Added
        doc.text(`Change: \u20B1${parseFloat(order.change).toFixed(2)}`, 10, 110); // Added
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Amount: \u20B1${order.total.toFixed(2)}`, 10, 120);

        // QR Code
        const qrCanvas = qrRef.current;
        if (qrCanvas) {
            const qrDataUrl = qrCanvas.toDataURL("image/png");
            doc.addImage(qrDataUrl, 'PNG', 150, 60, 50, 50);
        }

        // Footer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your purchase!', 105, 150, { align: 'center' });

        // Save as PDF
        doc.save(`Order_${order.id}.pdf`);
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
        <Container fluid className={StaffTransactionScss.transactionMainContainer}>
            <h4><FaSave size={25}/>Your Saved Orders</h4>
            <div className={StaffTransactionScss.containerFilter}>
                <Row className="m-2 mt-3">
                    <Col md={6} sm={12} className="mb-2">
                        <Form.Control
                            type="date"
                            placeholder="Filter by Date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-info"
                        />
                    </Col>
                    <Col md={6} sm={12} className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Filter by Customer Name"
                            value={filterCustomer}
                            onChange={(e) => setFilterCustomer(e.target.value)}
                        />
                    </Col>
                </Row>
            </div>

            <div className={StaffTransactionScss.transactionchildContainer} >

                {/* Mapped Order List */}
                <ListGroup variant="flush">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <ListGroup.Item key={order.id} className={StaffTransactionScss.ListGroupItem}>
                                <div>
                                    <h5 className="p-0 mb-2">Order ID: {order.id}</h5>
                                    <p className="p-0 m-0">Order Date: {order.date}</p>
                                    <p className="p-0 m-0">Customer Name: {order.customerName}</p>
                                    <p className="p-0 m-0">Total: ₱{order.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <Button
                                        variant="outline-info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowModal(order)}
                                    >
                                        <FaEye size={15}/>
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleDownloadOrder(order)}
                                    >
                                        <FaDownload size={15}/>
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item className="text-center">No saved orders</ListGroup.Item>
                    )}
                </ListGroup>
            </div>

            {/* Updated Modal for viewing order details */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
                <Modal.Header closeButton>
                    <Modal.Title><FaTruckRampBox size={20} className="me-2"/>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <Container>
                            <h5 className="mb-2 text-primary">Order Summary</h5>
                            <ListGroup variant="flush" style={{ height: 150, overflow: 'auto' }}>
                                <ListGroup.Item><strong>Order Date:</strong> {selectedOrder.date}</ListGroup.Item>
                                <ListGroup.Item><strong>Customer Name:</strong> {selectedOrder.customerName}</ListGroup.Item>
                                <ListGroup.Item><strong>Subtotal:</strong> ₱{selectedOrder.subtotal.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Tax:</strong> {selectedOrder.tax.toFixed(2)}%</ListGroup.Item>
                                <ListGroup.Item><strong>Discount:</strong> {selectedOrder.discount.toFixed(2)}%</ListGroup.Item>
                                <ListGroup.Item><strong>Payment Amount:</strong> ₱{parseFloat(selectedOrder.paymentAmount).toFixed(2)}</ListGroup.Item> {/* Added */}
                                <ListGroup.Item><strong>Change:</strong> ₱{parseFloat(selectedOrder.change).toFixed(2)}</ListGroup.Item> {/* Added */}
                                <ListGroup.Item><strong>Total Amount:</strong> <strong>₱{selectedOrder.total.toFixed(2)}</strong></ListGroup.Item>
                            </ListGroup>

                            <h5 className="mt-3 text-primary">Items</h5>
                            <ListGroup variant="flush" style={{ height: '100px', overflow: 'auto' }}>
                                {selectedOrder.items.map((item, index) => {
                                    const price = parseFloat(item.price);
                                    const total = price * item.quantity;
                                    return (
                                        <ListGroup.Item key={index}>
                                            <div className="d-flex justify-content-between">
                                                <p><strong>Product:</strong> {item.productName}</p>
                                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <p><strong>Unit Price:</strong> ₱{price.toFixed(2)}</p>
                                                <p><strong>Total:</strong> ₱{total.toFixed(2)}</p>
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>

                            <h5 className="mt-4 text-primary">Download Receipt QR Code</h5>
                            <div className="d-flex justify-content-center">
                                <canvas ref={qrRef} style={{ maxWidth: "100%", height: "auto" }} />
                            </div>
                        </Container>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>


        </Container>
    );
}
export default AdminTransactionHistory;
