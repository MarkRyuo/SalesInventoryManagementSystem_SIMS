import { Container, Navbar, Row, Col, Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import jsPDF from 'jspdf';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

function TransactionHistory() {
    const [orderHistory, setOrderHistory] = useState([]);
    const db = getDatabase();

    useEffect(() => {
        const historyRef = ref(db, 'TransactionHistory/');
        onValue(historyRef, (snapshot) => {
            const data = snapshot.val() || {};
            const formattedHistory = Object.entries(data).map(([key, value]) => ({
                ...value,
                id: key
            }));
            setOrderHistory(formattedHistory);
        });
    }, [db]);

    const handleDownloadOrder = (order) => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Receipt', 105, 10, { align: 'center' });

        // Order details
        doc.setFontSize(12);
        doc.text(`Order Date: ${order.date}`, 10, 30);
        doc.text(`Total Amount: ₱${order.total.toFixed(2)}`, 10, 40); // Updated to peso sign

        // Adding a line
        doc.line(10, 45, 200, 45); // horizontal line

        // Table header
        doc.setFontSize(14);
        doc.text('Product Name', 10, 50);
        doc.text('Quantity', 90, 50);
        doc.text('Total', 160, 50);

        // Adding another line for header separation
        doc.line(10, 52, 200, 52); // horizontal line

        // Adding items to the receipt
        order.items.forEach((item, index) => {
            const yPosition = 60 + (index * 10);
            doc.text(item.productName, 10, yPosition);
            doc.text(item.quantity.toString(), 90, yPosition);
            doc.text(`₱${(item.price * item.quantity).toFixed(2)}`, 160, yPosition); // Updated to peso sign
        });

        // Save the PDF
        doc.save('order.pdf');
    };

    const handleDeleteOrder = (id) => {
        const orderRef = ref(db, `TransactionHistory/${id}`);
        remove(orderRef);
    };

    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-light shadow-sm">
                <Container>
                    <Navbar.Brand className="fs-4">Transaction History</Navbar.Brand>
                </Container>
            </Navbar>
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
        </Container>
    );
}

export default TransactionHistory;
