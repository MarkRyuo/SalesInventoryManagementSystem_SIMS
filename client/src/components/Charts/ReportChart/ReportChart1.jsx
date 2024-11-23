import { useEffect, useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import ReportChartcss from './ReportChart.module.scss';
import { fetchStockInOverview, fetchStockInByDate } from '../../../services/SalesReports/StockInReportService';  // Import the helpers

function ReportChart1() {
    const [totalStock, setTotalStock] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    // Fetch total stock when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const stock = await fetchStockInOverview();
                setTotalStock(stock);  // Set the total stock
            } catch (error) {
                console.error("Error fetching total stock:", error);
            }
        };
        fetchData();
    }, []);

    // Handle the filter action
    const handleFilter = async () => {
        try {
            const data = await fetchStockInByDate(startDate, endDate);
            setFilteredData(data); // Store the filtered data
        } catch (error) {
            console.error("Error filtering data:", error);
        }
    };

    // Download PDF function with detailed product info
    const downloadPDF = (data) => {
        const doc = new jsPDF();

        // Set up the table headers
        doc.setFontSize(12);
        doc.text('Filtered Stock In Data', 10, 10);

        const headers = ['No.', 'Product Name', 'Barcode', 'SKU', 'Date', 'Quantity', 'Price'];

        // Table column positions and sizes
        const columnWidths = [10, 50, 30, 30, 25, 20, 25]; // Adjust widths as needed
        let y = 20; // Start position for the first row

        // Draw table headers
        headers.forEach((header, index) => {
            doc.text(header, 10 + (columnWidths.slice(0, index).reduce((a, b) => a + b, 0)), y);
        });

        y += 5; // Space between header and data rows

        // Draw the table data
        data.forEach((entry, index) => {
            doc.text((index + 1).toString(), 10, y);  // Serial number
            doc.text(entry.productName, 10 + columnWidths[0], y);  // Product Name
            doc.text(entry.barcode, 10 + columnWidths[0] + columnWidths[1], y);  // Barcode
            doc.text(entry.sku, 10 + columnWidths[0] + columnWidths[1] + columnWidths[2], y);  // SKU
            doc.text(entry.addedQuantityHistory.date, 10 + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], y);  // Date
            doc.text(entry.addedQuantityHistory.quantity.toString(), 10 + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], y);  // Quantity
            doc.text(entry.price, 10 + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4] + columnWidths[5], y);  // Price
            y += 10;  // Increment y position for the next row

            // Add a page if necessary
            if (y > 280) {  // Check if the content is about to overflow the page
                doc.addPage();
                y = 20;  // Reset y position for the next page
            }
        });

        // Save the document
        doc.save('stock_in_report.pdf');
    };


    // Download XLSX function with detailed product info
    const downloadXLSX = (data) => {
        const formattedData = data.map(entry => ({
            ProductName: entry.productName,
            Barcode: entry.barcode,
            SKU: entry.sku,
            Date: entry.addedQuantityHistory.date,
            Quantity: entry.addedQuantityHistory.quantity,
            Price: entry.price
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Stock In Data');
        XLSX.writeFile(wb, 'stock_in_report.xlsx');
    };

    return (
        <div className={ReportChartcss.containerChart1}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={23} />
                <p className='m-0 p-0'>Stock Overview</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className="m-0 p-2">{`Total Stock: ${totalStock}`}</p>
            </div>
            <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Filter by Date
                </Button>
                <Button
                    variant="success"
                    onClick={() => downloadPDF(filteredData)}
                    disabled={filteredData.length === 0}
                >
                    Download PDF
                </Button>
                <Button
                    variant="success"
                    onClick={() => downloadXLSX(filteredData)}
                    disabled={filteredData.length === 0}
                >
                    Download XLSX
                </Button>
            </div>

            {/* Modal for date filtering */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Stock In by Date</Modal.Title>
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
                        <Button variant="primary" onClick={handleFilter}>Filter</Button>
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

export default ReportChart1;
