import { Container, Navbar, Row, Col, Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import jsPDF from 'jspdf';

function TransactionHistory() {
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('TransactionHistory')) || [];
        setOrderHistory(storedHistory);
    }, []);

    const handleDownloadOrder = (order) => {
        const doc = new jsPDF();
        doc.text(`Order Date: ${order.date}`, 10, 10);
        doc.text(`Total Amount: $${order.total.toFixed(2)}`, 10, 20);
        order.items.forEach((item, index) => {
            doc.text(`${item.productName} - Quantity: ${item.quantity} - Total: $${(item.price * item.quantity).toFixed(2)}`, 10, 30 + (index * 10));
        });
        doc.save('order.pdf');
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
                                    orderHistory.map((order, index) => (
                                        <tr key={index}>
                                            <td>{order.date}</td>
                                            <td>${order.total.toFixed(2)}</td>
                                            <td>
                                                <Button variant="primary" onClick={() => handleDownloadOrder(order)}>Download</Button>
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
