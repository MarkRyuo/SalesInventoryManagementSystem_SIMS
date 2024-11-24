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
            {/* Filter Button */}
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Filter by Date
            </Button>

            {/* Report Stats */}
            <div className={ReportChartcss.containerChart4}>
                <div className={ReportChartcss.containerText}>
                    <FaReact size={23} />
                    <p className="m-0 p-0">Low Stock Overview</p>
                </div>
                <div className={ReportChartcss.contentChart}>
                    <p className="m-0 p-2">{lowStockData.length}</p> {/* Dynamic low stock count */}
                    <p className="m-0 pb-2">From {startDate} to {endDate}</p> {/* Dynamic date range */}
                </div>
            </div>

            {/* Download Buttons */}
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
                        <Button variant="primary" onClick={handleFilter}>
                            Filter
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Display Low Stock Report */}
            <div>
                {lowStockData.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Barcode</th>
                                <th>Quantity</th>
                                <th>In-Stock Threshold</th>
                                <th>Status</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default LowStockReport;
