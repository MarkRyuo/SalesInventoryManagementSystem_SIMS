import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import ReportChartcss from './ReportChart.module.scss';
import { fetchStockInOverview, fetchStockInByDate } from '../../../services/SalesReports/StockInReportService';  // Import the helpers
import 'jspdf-autotable';  // Import jsPDF auto-table for table handling

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

        // Title for the document
        doc.setFontSize(12);
        doc.text('Filtered Stock In Data', 10, 10);

        // Create table headers and data
        const tableHeaders = ['No.', 'Product Name', 'Barcode', 'SKU', 'Date', 'Quantity', 'Price'];
        const tableData = data.map((entry, index) => [
            (index + 1).toString(),
            entry.productName,
            entry.barcode,
            entry.sku,
            entry.addedQuantityHistory.date,
            entry.addedQuantityHistory.quantity.toString(),
            entry.price,
        ]);

        // Use jsPDF autoTable plugin to generate the table
        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 20,  // Starting Y position
            theme: 'grid',  // Table theme
            columnStyles: {
                0: { cellWidth: 10 },  // Column 1 (No.)
                1: { cellWidth: 50 },  // Column 2 (Product Name)
                2: { cellWidth: 30 },  // Column 3 (Barcode)
                3: { cellWidth: 30 },  // Column 4 (SKU)
                4: { cellWidth: 25 },  // Column 5 (Date)
                5: { cellWidth: 20 },  // Column 6 (Quantity)
                6: { cellWidth: 25 },  // Column 7 (Price)
            },
            margin: { top: 20 },  // Set the top margin for table
        });

        // Save the document
        doc.save('stock_in_report.pdf');
    };


    // Download XLSX function with detailed product info

    const downloadXLSX = (data) => {
        // Format the data
        const formattedData = data.map(entry => ({
            ProductName: entry.productName,
            Barcode: entry.barcode,
            SKU: entry.sku,
            Date: entry.addedQuantityHistory.date,
            Quantity: entry.addedQuantityHistory.quantity,
            Price: entry.price
        }));

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Create worksheet from the formatted data
        const ws = XLSX.utils.json_to_sheet(formattedData);

        // Set column widths for better formatting
        ws['!cols'] = [
            { width: 20 },  // Product Name
            { width: 15 },  // Barcode
            { width: 10 },  // SKU
            { width: 15 },  // Date
            { width: 10 },  // Quantity
            { width: 15 },  // Price
        ];

        // Add header style
        Object.keys(ws).forEach((cellRef) => {
            if (cellRef.includes('1')) {  // This is where the header row is
                ws[cellRef].s = {
                    font: { bold: true },        // Make header text bold
                    alignment: { horizontal: 'center' },  // Center align
                    fill: { patternType: 'solid', fgColor: { rgb: 'FFFF00' } }, // Yellow background color
                    border: {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    },
                };
            }
        });

        // Add the sheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Stock In Data');

        // Write the Excel file
        XLSX.writeFile(wb, 'stock_in_report.xlsx');
    };


    return (
        <div className={ReportChartcss.containerChart1}>
                
            <h1 className="m-0 p-0">Stock Overview</h1>
            <p className="m-0 p-0"><span>Total Stock</span>{`${totalStock}`}</p>    
            <Button variant="" onClick={() => setShowModal(true)}>
                Filter by Date
            </Button>

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
                        <Button variant="primary" onClick={handleFilter} className="mt-3 w-100">
                            Filter
                        </Button>
                    </Form>
                    <div className="d-flex justify-content-between mt-4">
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
