import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import ReportChartcss from './ReportChart.module.scss';
import { fetchSalesReportData } from './SalesReportQuantitySoldFetcher';
import "jspdf-autotable"; // For better table handling (optional but recommended)

function SalesReportQuantitySold() {
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [netRevenue, setNetRevenue] = useState(0);

    // Handle filtering
    const handleFilter = async () => {
        const {
            filteredData,
            totalQuantity,
            totalRevenue,
            totalDiscount,
            totalTax,
            netRevenue
        } = await fetchSalesReportData(startDate, endDate);

        setFilteredData(filteredData);
        setTotalQuantity(totalQuantity);
        setTotalRevenue(totalRevenue);
        setTotalDiscount(totalDiscount);
        setTotalTax(totalTax);
        setNetRevenue(netRevenue);
    };

    // Download PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Sales Report - Quantity Sold", 10, 10);

        const tableData = filteredData.map((entry) => [
            entry.productName,
            entry.totalQuantity.toString(),
            `₱${entry.price.toFixed(2)}`,
            entry.discount.toFixed(2),
            entry.tax.toFixed(2),
            `₱${entry.total.toFixed(2)}`,
        ]);

        doc.autoTable({
            head: [["Product Name", "Total Quantity", "Price", "Discount", "Tax", "Total"]],
            body: tableData,
            startY: 20,
        });

        const totalY = doc.previousAutoTable.finalY + 10;
        doc.text(`Total Quantity Sold: ${totalQuantity}`, 10, totalY);
        doc.text(`Total Revenue: ₱${totalRevenue.toFixed(2)}`, 10, totalY + 10);
        doc.text(`Discounts Applied: ₱${totalDiscount.toFixed(2)}`, 10, totalY + 20);
        doc.text(`Tax Collected: ₱${totalTax.toFixed(2)}`, 10, totalY + 30);
        doc.text(`Net Revenue: ₱${netRevenue.toFixed(2)}`, 10, totalY + 40);

        doc.save("sales_report_quantity_sold.pdf");
    };

    // Download XLSX
    const downloadXLSX = () => {
        const formattedData = filteredData.map((entry) => ({
            ProductName: entry.productName,
            TotalQuantity: entry.totalQuantity,
            Price: `₱${entry.price.toFixed(2)}`,
            Discount: entry.discount.toFixed(2),
            Tax: entry.tax.toFixed(2),
            Total: `₱${entry.total.toFixed(2)}`,
        }));

        formattedData.push({
            TotalQuantitySold: totalQuantity,
            TotalRevenue: `₱${totalRevenue.toFixed(2)}`,
            DiscountsApplied: `₱${totalDiscount.toFixed(2)}`,
            TaxCollected: `₱${totalTax.toFixed(2)}`,
            NetRevenue: `₱${netRevenue.toFixed(2)}`,
        });

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        XLSX.writeFile(wb, "sales_report_quantity_sold.xlsx");
    };

    return (
        <div className={ReportChartcss.containerChart3}>
            {/* Report Header */}
            <div className={ReportChartcss.containerText}>
                <FaReact size={23} />
                <p className='m-0 p-0'>Sales Report: Quantity Sold</p>
            </div>

            {/* Report Summary */}
            <div className={ReportChartcss.contentChart}>
                <p className="m-0 p-2">{`Total Quantity Sold: ${totalQuantity}`}</p>
                <p className="m-0 pb-2">{`Total Revenue: ₱${totalRevenue.toFixed(2)}`}</p>
            </div>

            {/* Filter and Action Buttons */}
            <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Filter by Date
                </Button>
                <Button variant="success" onClick={downloadPDF} disabled={filteredData.length === 0}>
                    Download PDF
                </Button>
                <Button variant="success" onClick={downloadXLSX} disabled={filteredData.length === 0}>
                    Download XLSX
                </Button>
            </div>

            {/* Modal for Date Filtering */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Sales Report</Modal.Title>
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

export default SalesReportQuantitySold;
