import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import ReportChartcss from './ReportChart.module.scss';
import { fetchTotalSales } from "../../../services/SalesReports/TotalSalesService";
import "jspdf-autotable"; // For better table handling (optional but recommended)

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

        const tableData = filteredTransactions.map((entry) => [
            entry.id?.toString() || "N/A",
            entry.customerName || "N/A",
            (Number(entry.discountPercentage) || 0).toFixed(2), // Ensure it's a number
            (Number(entry.paymentAmount) || 0).toFixed(2), // Ensure it's a number
            (Number(entry.tax) || 0).toFixed(2), // Ensure it's a number
            entry.totalQuantity?.toString() || "0",
            (Number(entry.total) || 0).toFixed(2), // Ensure it's a number
        ]);

        doc.autoTable({
            head: [["ID", "Customer Name", "Discount %", "Payment", "Tax", "Quantity", "Total"]],
            body: tableData,
            startY: 20,
        });

        const totalY = doc.previousAutoTable.finalY + 10;
        doc.text(`Total Sales: ₱${(Number(totalSales) || 0).toFixed(2)}`, 10, totalY); // Ensure it's a number

        doc.save("sales_report.pdf");
    };

    // Download XLSX
    const downloadXLSX = () => {
        const formattedData = filteredTransactions.map((entry) => ({
            ID: entry.id || "N/A",
            CustomerName: entry.customerName || "N/A",
            DiscountPercentage: (Number(entry.discountPercentage) || 0).toFixed(2), // Ensure it's a number
            PaymentAmount: (Number(entry.paymentAmount) || 0).toFixed(2), // Ensure it's a number
            Tax: (Number(entry.tax) || 0).toFixed(2), // Ensure it's a number
            TotalQuantity: entry.totalQuantity || 0,
            Total: (Number(entry.total) || 0).toFixed(2), // Ensure it's a number
        }));

        formattedData.push({ TotalSales: (Number(totalSales) || 0).toFixed(2) }); // Ensure it's a number

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        XLSX.writeFile(wb, "sales_report.xlsx");
    };

    return (
        <div className={ReportChartcss.containerChart2}>
                <p className="m-0 p-0">Total Sales</p>
            <div className={ReportChartcss.contentChart}>
                <p className="m-0 p-2">{`₱${totalSales.toFixed(2)}`}</p>
                <p className="m-0 pb-2">Filtered by date range</p>
            </div>
            <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Filter by Date
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
                        <Button variant="primary" onClick={handleFilter} className="mt-3 w-100">
                            Filter
                        </Button>
                    </Form>
                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            variant="success"
                            onClick={downloadPDF}
                            disabled={filteredTransactions.length === 0}
                        >
                            Download PDF
                        </Button>
                        <Button
                            variant="success"
                            onClick={downloadXLSX}
                            disabled={filteredTransactions.length === 0}
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

export default ReportChart2;
