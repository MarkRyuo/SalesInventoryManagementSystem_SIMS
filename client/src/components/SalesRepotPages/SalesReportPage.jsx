import { useState } from "react";
import { Button, Form, Row, Col, Table } from "react-bootstrap";

const SalesReportPage = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reportType, setReportType] = useState("Overall Summary");
    const [previewData, setPreviewData] = useState([]);

    const handleGenerateReport = () => {
        // Fetch data logic will go here
        console.log("Generating report for:", startDate, endDate, reportType);
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

                <Button onClick={handleGenerateReport} variant="primary">
                    Generate Report
                </Button>
            </Form>

            {/* Preview Section */}
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
                            {previewData.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{data.productName}</td>
                                    <td>{data.quantitySold}</td>
                                    <td>{data.totalSales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Download Buttons */}
            <div className="mt-3">
                <Button variant="success" className="me-2">
                    Download PDF
                </Button>
                <Button variant="info">
                    Download Excel
                </Button>
            </div>
        </div>
    );
};

export default SalesReportPage;
