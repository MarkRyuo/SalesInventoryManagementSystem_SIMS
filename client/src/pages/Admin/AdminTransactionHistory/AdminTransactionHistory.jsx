import { Container, Button, Modal, ListGroup, Row, Col, Form } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import QRious from 'qrious';
import { FaEye, FaDownload, FaTrash } from "react-icons/fa";
import AdminTransactionScss from './AdminTransactionHistory.module.scss';
import { FaSave } from "react-icons/fa";
import { FaTruckRampBox } from "react-icons/fa6";

function AdminTransactionHistory() {
    const [orderHistory, setOrderHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
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
                value: `https://us-central1-salesinventorymanagement-1bb27.cloudfunctions.net/downloadOrder?id=${selectedOrder.id}`, // Updated to Firebase Function URL
                size: 256,
            });

        }
    }, [selectedOrder]);
    
    const handleDownloadOrder = async (order) => {
        const doc = new jsPDF();

        // Using default fonts like Helvetica (most fonts support ₱)
        doc.setFont('courier', 'normal');  // Use Helvetica which supports the peso sign

        // Title and Store Info (aligned to the left)
        doc.setFontSize(12);
        doc.text('REYES ELECTRONIC SHOP', 10, 20);  // Aligned to left
        doc.setFontSize(10);
        doc.text('JP Rizal St. Población Barangay 4, 4217 Lipa City Batangas Philippines', 10, 30);
        doc.text('RAMIL P. REYES - PROP.', 10, 40);

        // Order Date (aligned to the left)
        doc.setFontSize(12);
        doc.text(`Order Date: ${order.date}`, 10, 50);

        // Customer info (aligned to the left)
        doc.text(`Sold To: ${order.customerName}`, 10, 60);

        // Separator Line
        doc.line(10, 65, 200, 65); // Draw line to separate items and total

        // Product Table (aligned columns)
        let yPosition = 75;
        doc.setFontSize(10);
        doc.text("Product Name", 10, yPosition);
        doc.text("Qty", 100, yPosition, { align: "center" });
        doc.text("Price", 140, yPosition, { align: "right" });
        doc.text("Amount", 180, yPosition, { align: "right" });

        // Product list loop
        yPosition += 10;
        order.items.forEach(item => {
            doc.text(item.productName, 10, yPosition);
            doc.text(item.quantity.toString(), 100, yPosition, { align: "center" });
            doc.text(`₱${parseFloat(item.price).toFixed(2)}`, 140, yPosition, { align: "right" });
            doc.text(`₱${parseFloat(item.totalAmount).toFixed(2)}`, 180, yPosition, { align: "right" });
            yPosition += 10;
        });

        // Separator Line for totals
        doc.line(10, yPosition, 200, yPosition);

        // Totals (aligned to the left)
        yPosition += 10;
        doc.text(`Subtotal: ₱${parseFloat(order.subtotal).toFixed(2)}`, 10, yPosition);
        doc.text(`Tax: ₱${parseFloat(order.tax).toFixed(2)}`, 10, yPosition + 10);
        doc.text(`Discount: -₱${parseFloat(order.discount).toFixed(2)}`, 10, yPosition + 20);
        doc.text(`Payment Amount: ₱${parseFloat(order.paymentAmount).toFixed(2)}`, 10, yPosition + 30);
        doc.text(`Change: ₱${parseFloat(order.change).toFixed(2)}`, 10, yPosition + 40);

        doc.setFontSize(14);
        doc.setFont('courier', 'bold');
        doc.text(`Total Amount: ₱${parseFloat(order.total).toFixed(2)}`, 10, yPosition + 50);

        // QR Code (aligned to the left)
        const qrCanvas = qrRef.current;
        if (qrCanvas) {
            const qrDataUrl = qrCanvas.toDataURL("image/png");
            doc.addImage(qrDataUrl, 'PNG', 150, yPosition + 20, 50, 50);  // Position QR code
        }

        // Footer (centered)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('This is not official Receipt!', 105, yPosition + 80, { align: 'center' });  // Centered footer text

        // Save as PDF
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
            <h4><FaSave size={25}/>Your Saved Orders</h4>
            <div className={AdminTransactionScss.containerFilter}>
                <Row className="m-2 mt-3">
                    <Col md={6} sm={12} className="mb-2">
                        <Form.Control
                            type="date"
                            placeholder="Filter by Date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
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

            <div className={AdminTransactionScss.transactionchildContainer} >

                {/* Mapped Order List */}
                <ListGroup variant="flush">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <ListGroup.Item key={order.id} className={AdminTransactionScss.ListGroupItem}>
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
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleShowDeleteModal(order)}
                                    >
                                        <FaTrash size={15}/>
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
                                <ListGroup.Item>Order Date: {selectedOrder.date}</ListGroup.Item>
                                <ListGroup.Item>Customer Name: {selectedOrder.customerName}</ListGroup.Item>
                                <ListGroup.Item>Subtotal: ₱{selectedOrder.subtotal.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item>Tax:{selectedOrder.tax.toFixed(2)}%</ListGroup.Item>
                                <ListGroup.Item>Discount: {selectedOrder.discount.toFixed(2)}%</ListGroup.Item>
                                <ListGroup.Item>Payment Amount: ₱{parseFloat(selectedOrder.paymentAmount).toFixed(2)}</ListGroup.Item> {/* Added */}
                                <ListGroup.Item>Change: ₱{parseFloat(selectedOrder.change).toFixed(2)}</ListGroup.Item> {/* Added */}
                                <ListGroup.Item>Total Amount: ₱{selectedOrder.total.toFixed(2)}</ListGroup.Item>
                            </ListGroup>

                            <h5 className="mt-3 text-primary">Items</h5>
                            <ListGroup variant="flush" style={{ height: '100px', overflow: 'auto' }}>
                                {selectedOrder.items.map((item, index) => {
                                    const price = parseFloat(item.price);
                                    const total = price * item.quantity;
                                    return (
                                        <ListGroup.Item key={index}>
                                            <div className="d-flex justify-content-between">
                                                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Product: {item.productName}</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Unit Price: ₱{price.toFixed(2)}</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Total: ₱{total.toFixed(2)}</p>
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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Delete Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-danger font-weight-bold">
                        Warning: Deleting these products is permanent and cannot be undone!
                    </p>
                    <p className="font-weight-bold text-danger">
                        {selectedOrder ? getProductNames(selectedOrder) : ''}
                    </p>
                    <p>Delete this order permanently?</p>
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleDeleteOrder(selectedOrder.id)}>Delete</Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}
export default AdminTransactionHistory;
