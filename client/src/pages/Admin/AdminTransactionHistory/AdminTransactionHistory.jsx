import { Container, Button, Modal, ListGroup, Row, Col, Form } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import QRious from 'qrious';
import { FaEye, FaDownload, FaTrash } from "react-icons/fa"; // Importing icons
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
        onValue(historyRef, (snapshot) => {
            const data = snapshot.val() || {};
            const formattedHistory = Object.entries(data).map(([key, value]) => ({
                ...value,
                id: key,
                subtotal: parseFloat(value.subtotal) || 0,
                tax: parseFloat(value.tax) || 0,
                discount: parseFloat(value.discount) || 0,
                total: parseFloat(value.total) || 0,
                // Format the date if it's a timestamp
                date: value.date ? new Date(value.date).toLocaleDateString() : 'N/A', // Format the date
                items: value.items.map(item => ({
                    ...item,
                    price: parseFloat(item.price) || 0
                }))
            }));
            setOrderHistory(formattedHistory);
        });
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
            // Generate QR code with correct URL format
            const url = `https://salesinventorymanagement-1bb27.web.app/ProductPage/${selectedOrder.id}`;
            console.log("QR Code URL:", url);

            new QRious({
                element: qrRef.current,
                value: url,
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

        // Pricing Breakdown using Unicode for Peso Symbol
        doc.text(`Subtotal: \u20B1${order.subtotal.toFixed(2)}`, 10, 70);
        doc.text(`Tax (12%): \u20B1${order.tax.toFixed(2)}`, 10, 80);
        doc.text(`Discount: -\u20B1${order.discount.toFixed(2)}`, 10, 90);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Amount: \u20B1${order.total.toFixed(2)}`, 10, 110);

        // QR Code
        const qrCanvas = qrRef.current;
        if (qrCanvas) {
            const qrDataUrl = qrCanvas.toDataURL("image/png");
            doc.addImage(qrDataUrl, 'PNG', 150, 60, 50, 50);
        }

        // Footer Message
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your purchase!', 105, 150, { align: 'center' });

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
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title><FaTruckRampBox size={20} className="me-2"/>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <Container>
                            {/* Order Summary Section */}
                            <h5 className="mb-2 text-primary">Order Summary</h5>
                            <ListGroup variant="flush" style={{height: 150, overflow: 'auto'}}>
                                <ListGroup.Item><strong>Order Date:</strong> {selectedOrder.date}</ListGroup.Item>
                                <ListGroup.Item><strong>Customer Name:</strong> {selectedOrder.customerName}</ListGroup.Item>
                                <ListGroup.Item><strong>Subtotal:</strong> ₱{selectedOrder.subtotal.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Tax:</strong> {selectedOrder.tax.toFixed(2)}%</ListGroup.Item>
                                <ListGroup.Item><strong>Discount:</strong> {selectedOrder.discount.toFixed(2)}%</ListGroup.Item>
                                <ListGroup.Item><strong>Total Amount:</strong> <strong>₱{selectedOrder.total.toFixed(2)}</strong></ListGroup.Item>
                            </ListGroup>

                            {/* Items Section */}
                            <h5 className="mt-3 text-primary">Items</h5>
                            <ListGroup variant="flush" style={{height: '100px', overflow: 'auto'}}>
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

                            {/* QR Code Section */}
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
            <Modal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                centered
            >
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Delete Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-danger font-weight-bold">
                        Warning: Deleting the following products is permanent and cannot be undone:
                    </p>
                    <p className="font-weight-bold text-danger">
                        {selectedOrder ? getProductNames(selectedOrder) : ''}
                    </p>
                    <p>Are you sure you want to delete this order?</p>
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
