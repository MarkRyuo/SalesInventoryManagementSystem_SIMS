import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Table } from "react-bootstrap";
import { fetchSavedOrders, deleteSavedOrder } from "../../../services/ProductService"; // Assuming you have a delete function in the service
import jsPDF from "jspdf";
import { LuDownload } from "react-icons/lu";
import { GrView } from "react-icons/gr";
import { FaTruckRampBox } from "react-icons/fa6";
import SavedOrderDetailsScss from './SCSS/SavedOrder.module.scss' ;
import { FaTrash } from "react-icons/fa6";

function SavedOrderDetails() {
    const [savedOrders, setSavedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState({}); // Track expanded state of each order

    // Fetch saved order details
    const fetchOrders = async () => {
        try {
            const orders = await fetchSavedOrders();
            setSavedOrders(orders);
        } catch (error) {
            setError("Error fetching saved orders.");
            console.error("Error fetching saved orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            setLoading(true);
            setError(null);
            fetchOrders();
        }
    }, [showModal]);

    // Handle modal close
    const handleCloseModal = () => setShowModal(false);

    // Toggle product list visibility
    const toggleShowMore = (orderId) => {
        setExpandedOrders((prevState) => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    };

    // Generate PDF for the order
    const downloadPDF = (order) => {
        const doc = new jsPDF();

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Order Details", 10, 10);

        // Order ID and Date
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Order ID: ${order.id}`, 10, 20);
        doc.text(`Order Date: ${new Date(order.date).toLocaleDateString()}`, 10, 30);

        let y = 40; // Starting Y position for products

        // Product Heading
        doc.setFont("helvetica", "bold");
        doc.text("Products:", 10, y);
        y += 10; // Add some space after the heading

        // Table headers for products
        doc.setFont("helvetica", "normal");
        doc.text("No.", 10, y);
        doc.text("Name", 30, y);
        doc.text("SKU", 100, y);
        doc.text("Quantity", 150, y);
        y += 10;

        // Draw a line separating the headers from the product list
        doc.line(10, y, 200, y);
        y += 10;

        // Product List
        order.products.forEach((product, index) => {
            doc.text((index + 1).toString(), 10, y);
            doc.text(product.productName || "No Name", 30, y);
            doc.text(product.sku || "N/A", 100, y);
            doc.text((product.quantity || 0).toString(), 150, y);
            y += 10;

            // Add extra space after each product
            if (y > 270) {
                doc.addPage(); // Create a new page if it's close to the bottom of the current one
                y = 20; // Reset Y to the top of the new p  age
            }
        });

        // Footer
        doc.setFont("helvetica", "italic");
        doc.text("REYES ELECTRONICS!", 10, y + 10);

        // Trigger the download of the PDF
        doc.save(`${order.id}_order.pdf`);
    };


    // Delete an order
    const handleDeleteOrder = async (orderId) => {
        try {
            await deleteSavedOrder(orderId); // Assuming you have a delete function in your service
            setSavedOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
            alert('Order deleted successfully!');
        } catch (error) {
            setError("Error deleting order.");
            alert('Failed to delete order: ' + error.message);
        }
    };

    return (
        <div style={{display: "flex", alignItems: "flex-end"}}>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                <GrView size={17} className="me-1"/>View Saved Orders
            </Button>

            {/* Saved Orders Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title><FaTruckRampBox size={20} className="me-2 p-0"/>Saved Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>Loading...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <div>
                            {savedOrders.length > 0 ? (
                                <Table bordered hover responsive className={SavedOrderDetailsScss.tables}>
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Order Date</th>
                                            <th>Products</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedOrders.map((order, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td>{order.id || "No ID"}</td>
                                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                                    <td>
                                                        {order.products && order.products.length > 0
                                                            ? `${order.products.length} Product(s)`
                                                            : "No products"}
                                                    </td>
                                                    <td className={SavedOrderDetailsScss.ActionBtns}> 
                                                        <Button
                                                            variant=""
                                                            onClick={() => toggleShowMore(order.id)}
                                                            aria-expanded={expandedOrders[order.id]}
                                                            className="p-0"
                                                        >
                                                            {expandedOrders[order.id] ? "Hide" : "Show"}{" "}
                                                        </Button>
                                                        <Button
                                                            variant="info"
                                                            onClick={() => downloadPDF(order)}
                                                            className="ml-2 p-0"
                                                            style={{width: 40}}
                                                        >
                                                            <LuDownload/>
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleDeleteOrder(order.id)}
                                                            className="ml-2 p-0"
                                                            style={{width: 40}}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </td>
                                                </tr>
                                                {expandedOrders[order.id] && (
                                                    <tr>
                                                        <td colSpan="4">
                                                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                                <strong>Products:</strong>
                                                                <Table bordered hover responsive size="sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Product Name</th>
                                                                            <th>SKU</th>
                                                                            <th>Quantity</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {order.products.map((product, pIndex) => (
                                                                            <tr key={pIndex}>
                                                                                <td>{product.productName || "No Name"}</td>
                                                                                <td>{product.sku || "N/A"}</td>
                                                                                <td>{product.quantity || "0"}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p>No saved orders found.</p>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SavedOrderDetails;
