import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { fetchLowStockData } from "../../../services/SalesReports/LowStockService";
import "jspdf-autotable";
import { FaReact } from "react-icons/fa";
import ReportChartcss from './ReportChart.module.scss';

function LowStockReport() {
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [lowStockData, setLowStockData] = useState([]);

    // Handle filtering
    const handleFilter = async () => {
        const data = await fetchLowStockData(startDate, endDate);
        setLowStockData(data);
    };

    // Download PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Sales Report: Low Stock", 10, 10);
        doc.text(`Filter: Start ${startDate} End ${endDate}`, 10, 20);

        const tableData = lowStockData.map((entry) => [
            entry.productName,
            entry.sku,
            entry.barcode,
            entry.quantity.toString(),
            entry.instockthreshold.toString(),
            entry.status,
        ]);

        doc.autoTable({
            head: [
                ["Product Name", "SKU", "Barcode", "Quantity", "In-Stock Threshold", "Status"],
            ],
            body: tableData,
            startY: 30,
        });

        doc.save("low_stock_report.pdf");
    };

    // Download XLSX
    const downloadXLSX = () => {
        const formattedData = lowStockData.map((entry) => ({
            ProductName: entry.productName,
            SKU: entry.sku,
            Barcode: entry.barcode,
            Quantity: entry.quantity,
            InStockThreshold: entry.instockthreshold,
            Status: entry.status,
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Low Stock Report");
        XLSX.writeFile(wb, "low_stock_report.xlsx");
    };

    return (
        <div>
            {/* Low Stock Overview */}
            <div className={ReportChartcss.containerChart4}>
                    <p className="m-0 p-0">Low Stock Overview</p>
                <div className={ReportChartcss.contentChart}>
                    <p className="m-0 p-2">{lowStockData.length}</p> {/* Dynamic low stock count */}
                    <p className="m-0 pb-2">From {startDate} to {endDate}</p> {/* Dynamic date range */}
                </div>
                {/* Filter Button */}
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Filter by Date
                </Button>
            </div>

            {/* Modal for Date Filtering */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Low Stock Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                        <Button variant="primary" onClick={handleFilter} className="mt-3 w-100">
                            Filter
                        </Button>
                    </Form>
                    {/* Download Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            variant="success"
                            onClick={downloadPDF}
                            disabled={lowStockData.length === 0}
                        >
                            Download PDF
                        </Button>
                        <Button
                            variant="success"
                            onClick={downloadXLSX}
                            disabled={lowStockData.length === 0}
                        >
                            Download XLSX
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
}

export default LowStockReport;
