import { Container, Navbar, Row, Col, Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import jsPDF from 'jspdf';
import { QRCode } from 'qrcode.react'; // Corrected import

function TransactionHistory() {
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('TransactionHistory')) || [];
        setOrderHistory(storedHistory);
    }, []);

    const handleDownloadOrder = (order) => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Receipt', 105, 10, { align: 'center' });

        // Order details
        doc.setFontSize(12);
        doc.text(`Order Date: ${order.date}`, 10, 30);
        doc.text(`Total Amount: $${order.total.toFixed(2)}`, 10, 40);

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
            doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, yPosition);
        });

        // Save the PDF
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
                                    <th>QR Code</th>
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
                                            <td>
                                                <QRCode value={JSON.stringify(order)} size={64} /> {/* Encode the order details as JSON */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No saved orders</td>
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
