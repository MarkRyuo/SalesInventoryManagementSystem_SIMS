import { useState, useEffect } from "react";
import { fetchStockInByDate } from "./stockHelpers"; // Import the helper function for fetching stock
import { Button, Table, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

function StockInReports() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // Initial fetch if dates are set
        if (startDate && endDate) {
            fetchFilteredData();
        }
    }, [startDate, endDate]);

    const fetchFilteredData = async () => {
        try {
            const data = await fetchStockInByDate(startDate, endDate);
            setFilteredData(data);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Product ID', 'Product Name', 'SKU', 'Barcode', 'Quantity', 'Date Added']],
            body: filteredData.map(item => [
                item.productId,
                item.productName,
                item.sku,
                item.barcode,
                item.addedQuantityHistory.quantity,
                new Date(item.addedQuantityHistory.date).toLocaleDateString(),
            ]),
        });
        doc.save('stock-in-report.pdf');
    };

    const handleDownloadXLSX = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
            ProductID: item.productId,
            ProductName: item.productName,
            SKU: item.sku,
            Barcode: item.barcode,
            Quantity: item.addedQuantityHistory.quantity,
            DateAdded: new Date(item.addedQuantityHistory.date).toLocaleDateString(),
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock In Report");
        XLSX.writeFile(workbook, "stock-in-report.xlsx");
    };

    return (
        <div>
            <h1>Stock In Report</h1>

            {/* Date Range Filter */}
            <div>
                <Form>
                    <Form.Group controlId="startDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="endDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={fetchFilteredData}>Filter</Button>
                </Form>
            </div>

            {/* Table Display */}
            <div className="mt-4">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Barcode</th>
                            <th>Quantity</th>
                            <th>Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productId}</td>
                                <td>{item.productName}</td>
                                <td>{item.sku}</td>
                                <td>{item.barcode}</td>
                                <td>{item.addedQuantityHistory.quantity}</td>
                                <td>{new Date(item.addedQuantityHistory.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Download Buttons */}
            <div className="mt-4">
                <Button variant="success" onClick={handleDownloadPDF}>Download PDF</Button>
                <Button variant="info" onClick={handleDownloadXLSX} className="ml-2">Download XLSX</Button>
            </div>
        </div>
    );
}

export default StockInReports;
