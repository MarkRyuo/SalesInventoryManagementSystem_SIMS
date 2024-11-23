import { FaReact } from "react-icons/fa";
import ReportChartcss from './ReportChart.module.scss';
import { useEffect, useState } from 'react';
import { fetchAddedQuantityHistory } from '../../../services/ProductService'; // Adjust path
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

function ReportChart1() {
    const [stockInTotal, setStockInTotal] = useState(0);
    const [filter, setFilter] = useState("today");
    const [data, setData] = useState([]);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Helper functions for filtering
    const isSameDay = (date1, date2) => date1.toDateString() === date2.toDateString();

    const isWithinLastNDays = (date, now, n) => {
        const diff = now - date; // Difference in milliseconds
        return diff >= 0 && diff <= n * 24 * 60 * 60 * 1000; // Check if within the last `n` days
    };

    const isWithinRange = (date, start, end) => date >= new Date(start) && date <= new Date(end);

    useEffect(() => {
        fetchAddedQuantityHistory((fetchedData) => {
            setData(fetchedData || []);
            const now = new Date();
            const filteredTotal = fetchedData.reduce((total, entry) => {
                const entryDate = new Date(entry.date);
                if (filter === "today" && isSameDay(entryDate, now)) return total + entry.quantity;
                if (filter === "7days" && isWithinLastNDays(entryDate, now, 7)) return total + entry.quantity;
                if (filter === "month" && entryDate.getMonth() === now.getMonth()) return total + entry.quantity;
                if (filter === "year" && entryDate.getFullYear() === now.getFullYear()) return total + entry.quantity;
                return total;
            }, 0);
            setStockInTotal(filteredTotal);
        });
    }, [filter]);

    const downloadPDF = () => {
        const filteredData = data.filter((entry) => isWithinRange(new Date(entry.date), startDate, endDate));
        const doc = new jsPDF();
        doc.text("Stock-In Report", 10, 10);
        filteredData.forEach((entry, i) => {
            doc.text(`${i + 1}. Date: ${entry.date}, Quantity: ${entry.quantity}`, 10, 20 + i * 10);
        });
        doc.save("Stock-In-Report.pdf");
    };

    const downloadExcel = () => {
        const filteredData = data.filter((entry) => isWithinRange(new Date(entry.date), startDate, endDate));
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock-In Data");
        XLSX.writeFile(workbook, "Stock-In-Report.xlsx");
    };

    return (
        <div className={ReportChartcss.containerChart1}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Stock In Overview</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className='m-0'>{stockInTotal}</p>
                <p className='m-2'>
                    {filter === "today" && "From today"}
                    {filter === "7days" && "From the last 7 days"}
                    {filter === "month" && "From this month"}
                    {filter === "year" && "From this year"}
                </p>
                <select
                    className="form-select w-auto"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
                <Button variant="primary" onClick={() => setShowDownloadModal(true)}>
                    Download Report
                </Button>
            </div>

            {/* Modal for selecting date range */}
            <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Download Stock-In Report</Modal.Title>
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDownloadModal(false)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={downloadExcel}>
                        Download Excel
                    </Button>
                    <Button variant="danger" onClick={downloadPDF}>
                        Download PDF
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ReportChart1;
