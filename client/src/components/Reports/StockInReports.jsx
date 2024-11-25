import { useState } from "react";
import { fetchLowStockData } from "./Service/LowStock"; // Update import path
import { Button, Table, Form } from "react-bootstrap"; // Assuming you're using React-Bootstrap
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { MainLayout } from "../../layout/MainLayout";

function StockInReports() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [lowStockData, setLowStockData] = useState([]);

    // Handle date filter
    const handleFilter = async () => {
        const data = await fetchLowStockData(startDate, endDate);
        setLowStockData(data);
    };

    // Handle PDF download
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Low Stock Report", 20, 10);
        lowStockData.forEach((item, index) => {
            doc.text(
                `${index + 1}. ${item.productName} - ${item.quantity} (Low Stock)`,
                10,
                20 + index * 10
            );
        });
        doc.save("LowStockReport.pdf");
    };

    // Handle XLSX download
    const downloadXLSX = () => {
        const worksheet = XLSX.utils.json_to_sheet(lowStockData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Low Stock Report");
        XLSX.writeFile(workbook, "LowStockReport.xlsx");
    };

    return (
        <MainLayout>
            <div>
                <h1>Stock In Reports</h1>
                <div className="filter-section">
                    <Form>
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <Button onClick={handleFilter} className="mt-3">Filter</Button>
                </div>

                <div className="table-section mt-4">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Barcode</th>
                                <th>Quantity</th>
                                <th>Threshold</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.sku}</td>
                                    <td>{item.barcode}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.instockthreshold}</td>
                                    <td>{item.status}</td>
                                    <td>{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <div className="download-buttons mt-3">
                    <Button onClick={downloadPDF} className="me-2">
                        Download PDF
                    </Button>
                    <Button onClick={downloadXLSX}>Download XLSX</Button>
                </div>
            </div>
        </MainLayout>
    );
}

export default StockInReports;
