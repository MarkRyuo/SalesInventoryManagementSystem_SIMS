import { FaReact } from "react-icons/fa";
import ReportChartcss from './ReportChart.module.scss';
import { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

function ReportChart2() {
    const [totalSales, setTotalSales] = useState(0);
    const [timeRange, setTimeRange] = useState("Today");
    const [salesData, setSalesData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const calculateDateRange = useCallback(() => {
        const today = new Date();
        const philippineOffset = 8 * 60;
        const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);

        const startOfDay = new Date(localTime.getFullYear(), localTime.getMonth(), localTime.getDate());
        let startDate, endDate;

        switch (timeRange) {
            case "Today":
                startDate = startOfDay;
                endDate = localTime;
                break;
            case "7 Days":
                startDate = new Date(startOfDay.getTime() - 6 * 24 * 60 * 60 * 1000);
                endDate = localTime;
                break;
            case "Month":
                startDate = new Date(localTime.getFullYear(), localTime.getMonth(), 1);
                endDate = new Date(localTime.getFullYear(), localTime.getMonth() + 1, 0);
                break;
            case "Year":
                startDate = new Date(localTime.getFullYear(), 0, 1);
                endDate = new Date(localTime.getFullYear(), 11, 31);
                break;
            default:
                startDate = startOfDay;
                endDate = localTime;
        }

        return { startDate, endDate };
    }, [timeRange]);

    const fetchSalesData = useCallback(async () => {
        const db = getDatabase();
        const ordersRef = ref(db, "TransactionHistory");

        try {
            const snapshot = await get(ordersRef);
            if (!snapshot.exists()) {
                return [];
            }

            const orders = snapshot.val();
            return Object.keys(orders).map((key) => ({
                id: key,
                ...orders[key],
                totalAmount: parseFloat(orders[key].total) || 0,
                date: orders[key].date,
            }));
        } catch (error) {
            console.error("Error fetching sales data:", error);
            return [];
        }
    }, []);

    useEffect(() => {
        const fetchTotalSales = async () => {
            const salesData = await fetchSalesData();
            setSalesData(salesData);

            const { startDate, endDate } = calculateDateRange();

            const totalForRange = salesData.reduce((acc, sale) => {
                const saleDate = new Date(sale.date);
                if (saleDate >= startDate && saleDate <= endDate) {
                    acc += sale.totalAmount;
                }
                return acc;
            }, 0);

            setTotalSales(totalForRange);
        };

        fetchTotalSales();
    }, [timeRange, calculateDateRange, fetchSalesData]);

    const downloadPDF = () => {
        const filteredData = salesData.filter((sale) => {
            const saleDate = new Date(sale.date);
            return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
        });

        const doc = new jsPDF();
        doc.text("Sales Report", 10, 10);
        doc.text("Date       Product Name       Total Amount", 10, 20);

        filteredData.forEach((sale, i) => {
            doc.text(`${i + 1}. ${sale.date}       ${sale.productName || "N/A"}       ${sale.totalAmount}`, 10, 30 + i * 10);
        });

        doc.save("Sales-Report.pdf");
    };

    const downloadExcel = () => {
        const filteredData = salesData.filter((sale) => {
            const saleDate = new Date(sale.date);
            return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
        });

        const worksheetData = filteredData.map((sale) => ({
            Date: sale.date,
            "Product Name": sale.productName || "N/A",
            "Total Amount": sale.totalAmount,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");

        XLSX.writeFile(workbook, "Sales-Report.xlsx");
    };

    return (
        <div className={ReportChartcss.containerChart2}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={25} />
                <p className="m-0 p-0">Total Sales</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className="m-0">
                    {totalSales.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                </p>
                <select
                    className="form-select"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="Today">Today</option>
                    <option value="7 Days">7 Days</option>
                    <option value="Month">Month</option>
                    <option value="Year">Year</option>
                </select>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Download Report
                </Button>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Download Sales Report</Modal.Title>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
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

export default ReportChart2;
