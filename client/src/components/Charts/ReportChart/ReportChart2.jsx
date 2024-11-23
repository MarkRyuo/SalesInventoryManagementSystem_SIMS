import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import ReportChartcss from './ReportChart.module.scss';
import { fetchTotalSales } from "../../../services/SalesReports/StockInReportService";

function ReportChart2() {
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [totalSales, setTotalSales] = useState(0);

    // Handle filtering
    const handleFilter = async () => {
        try {
            const { filteredTransactions, totalSales } = await fetchTotalSales(startDate, endDate);
            setFilteredTransactions(filteredTransactions);
            setTotalSales(totalSales);
        } catch (error) {
            console.error("Error filtering data:", error);
        }
    };

    // Download PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Sales Report", 10, 10);

        // Table headers
        const headers = ["ID", "Customer Name", "Discount %", "Payment", "Tax", "Quantity", "Total"];
        const columnWidths = [20, 40, 30, 30, 20, 20, 30];
        let y = 20;

        headers.forEach((header, i) => {
            doc.text(header, 10 + (columnWidths.slice(0, i).reduce((a, b) => a + b, 0)), y);
        });

        y += 10;

        // Table data
        filteredTransactions.forEach((entry) => {
            const row = [
                entry.id,
                entry.customerName,
                entry.discountPercentage.toString(),
                entry.paymentAmount,
                entry.tax,
                entry.totalQuantity.toString(),
                entry.total,
            ];
            row.forEach((text, j) => {
                doc.text(text, 10 + (columnWidths.slice(0, j).reduce((a, b) => a + b, 0)), y);
            });
            y += 10;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });

        // Total sales
        y += 10;
        doc.text(`Total Sales: ${totalSales.toFixed(2)}`, 10, y);

        doc.save("sales_report.pdf");
    };

    // Download XLSX
    const downloadXLSX = () => {
        const formattedData = filteredTransactions.map((entry) => ({
            ID: entry.id,
            CustomerName: entry.customerName,
            DiscountPercentage: entry.discountPercentage,
            PaymentAmount: entry.paymentAmount,
            Tax: entry.tax,
            TotalQuantity: entry.totalQuantity,
            Total: entry.total,
        }));

        formattedData.push({ TotalSales: totalSales.toFixed(2) });

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        XLSX.writeFile(wb, "sales_report.xlsx");
    };

    return (
        <div className={ReportChartcss.containerChart2}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={23} />
                <p className="m-0 p-0">Total Sales</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className="m-0 p-2">{`₱${totalSales.toFixed(2)}`}</p>
                <p className="m-0 pb-2">Filtered by date range</p>
            </div>
            <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Filter by Date
                </Button>
                <Button variant="success" onClick={downloadPDF} disabled={filteredTransactions.length === 0}>
                    Download PDF
                </Button>
                <Button variant="success" onClick={downloadXLSX} disabled={filteredTransactions.length === 0}>
                    Download XLSX
                </Button>
            </div>

            {/* Modal for date filtering */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Total Sales</Modal.Title>
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
        </div>
    );
}

export default ReportChart2;
