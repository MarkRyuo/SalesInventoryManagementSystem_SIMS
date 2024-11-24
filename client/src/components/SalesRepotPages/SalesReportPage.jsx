import { useState } from "react";
import { Button, Form, Row, Col, Table, Alert, Spinner } from "react-bootstrap";
import { getDatabase, ref, query, orderByChild, startAt, endAt, get } from "firebase/database";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SalesReportPage = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reportType, setReportType] = useState("Overall Summary");
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const db = getDatabase();
            const ordersRef = ref(db, "orders"); // Adjust the node path
            const ordersQuery = query(
                ordersRef,
                orderByChild("date"),
                startAt(startDate),
                endAt(endDate)
            );

            const snapshot = await get(ordersQuery);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedData = Object.values(data).map((order, index) => ({
                    id: index + 1,
                    productName: order.productName,
                    quantitySold: order.quantity,
                    totalSales: order.totalAmount,
                }));
                setPreviewData(formattedData);
            } else {
                setPreviewData([]);
                setError("No sales data found for the selected date range.");
            }
        } catch (err) {
            console.error("Error fetching sales data:", err);
            setError("Failed to fetch sales data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Sales Report", 20, 10);
        doc.autoTable({
            head: [["#", "Product", "Quantity Sold", "Total Sales"]],
            body: previewData.map(({ id, productName, quantitySold, totalSales }) => [
                id,
                productName,
                quantitySold,
                totalSales,
            ]),
        });
        doc.save(`Sales_Report_${startDate}_to_${endDate}.pdf`);
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(previewData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(
            new Blob([excelBuffer], { type: "application/octet-stream" }),
            `Sales_Report_${startDate}_to_${endDate}.xlsx`
        );
    };

    return (
        <div className="container mt-4">
            <h2>Generate Sales Reports</h2>
            <p>Select a date range and download the report in your preferred format.</p>

            <Form>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Report Type</Form.Label>
                        <Form.Select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option>Overall Summary</option>
                            <option>Product-Wise</option>
                            <option>Category-Wise</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Button onClick={handleGenerateReport} variant="primary" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Generate Report"}
                </Button>
            </Form>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            {previewData.length > 0 && (
                <div className="mt-4">
                    <h4>Report Preview</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Quantity Sold</th>
                                <th>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.map((data) => (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td>{data.productName}</td>
                                    <td>{data.quantitySold}</td>
                                    <td>{data.totalSales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="mt-3">
                        <Button onClick={handleDownloadPDF} variant="success" className="me-2">
                            Download PDF
                        </Button>
                        <Button onClick={handleDownloadExcel} variant="info">
                            Download Excel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesReportPage;
