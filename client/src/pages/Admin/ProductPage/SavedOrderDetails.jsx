import { useEffect, useState } from "react";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import { fetchSavedOrders } from "../../../services/OrderService"; // assuming fetchSavedOrders is a service function

function SavedOrderDetails() {
    const [savedOrders, setSavedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Function to fetch saved order details
    const fetchOrders = async () => {
        try {
            const orders = await fetchSavedOrders();  // Fetch saved orders from Firebase
            setSavedOrders(orders);
        } catch (error) {
            console.error("Error fetching saved orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            setLoading(true);
            fetchOrders();
        }
    }, [showModal]);

    // Handle closing the modal
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                View Saved Orders
            </Button>

            {/* Saved Orders Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Saved Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <Table bordered hover responsive>
                            <thead className="table-primary">
                                <tr>
                                    <th>Order Date</th>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedOrders.length > 0 ? (
                                    savedOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td>{new Date(order.date).toLocaleDateString()}</td>
                                            <td>{order.productName}</td>
                                            <td>{order.sku}</td>
                                            <td>{order.quantity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No saved orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SavedOrderDetails;
