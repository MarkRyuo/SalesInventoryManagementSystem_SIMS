import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import ReportChartcss from './ReportChart.module.scss';
import { fetchSalesReportData } from '../../../services/SalesReports/QuantitySoldService';
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

    // Function to format numbers as Peso (₱)
    const formatPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

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
            formatPeso(entry.price),
            entry.discount.toFixed(2),
            entry.tax.toFixed(2),
            formatPeso(entry.total),
        ]);

        doc.autoTable({
            head: [["Product Name", "Total Quantity", "Price", "Discount", "Tax", "Total"]],
            body: tableData,
            startY: 20,
        });

        const totalY = doc.previousAutoTable.finalY + 10;
        doc.text(`Total Quantity Sold: ${totalQuantity}`, 10, totalY);
        doc.text(`Total Revenue: ${formatPeso(totalRevenue)}`, 10, totalY + 10);
        doc.text(`Discounts Applied: ${formatPeso(totalDiscount)}`, 10, totalY + 20);
        doc.text(`Tax Collected: ${formatPeso(totalTax)}`, 10, totalY + 30);
        doc.text(`Net Revenue: ${formatPeso(netRevenue)}`, 10, totalY + 40);

        doc.save("sales_report_quantity_sold.pdf");
    };

    // Download XLSX
    const downloadXLSX = () => {
        const formattedData = filteredData.map((entry) => ({
            ProductName: entry.productName,
            TotalQuantity: entry.totalQuantity,
            Price: formatPeso(entry.price),
            Discount: entry.discount.toFixed(2),
            Tax: entry.tax.toFixed(2),
            Total: formatPeso(entry.total),
        }));

        formattedData.push({
            TotalQuantitySold: totalQuantity,
            TotalRevenue: formatPeso(totalRevenue),
            DiscountsApplied: formatPeso(totalDiscount),
            TaxCollected: formatPeso(totalTax),
            NetRevenue: formatPeso(netRevenue),
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
                <p className="m-0 p-0">Sales Report: Quantity Sold</p>
            </div>

            {/* Report Summary */}
            <div className={ReportChartcss.contentChart}>
                <p className="m-0 p-2">{`Total Quantity Sold: ${totalQuantity}`}</p>
                <p className="m-0 pb-2">{`Total Revenue: ${formatPeso(totalRevenue)}`}</p>
            </div>

            {/* Filter Button */}
            <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Filter by Date
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
                        <Button variant="primary" onClick={handleFilter} className="mt-3 w-100">
                            Filter
                        </Button>
                    </Form>
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            variant="success"
                            onClick={downloadPDF}
                            disabled={filteredData.length === 0}
                        >
                            Download PDF
                        </Button>
                        <Button
                            variant="success"
                            onClick={downloadXLSX}
                            disabled={filteredData.length === 0}
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

export default SalesReportQuantitySold;
