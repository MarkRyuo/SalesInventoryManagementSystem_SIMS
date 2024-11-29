import { useState, useEffect } from "react";
import { fetchLowStockData } from "./Service/LowStock";
import { Button, Table, Form, Dropdown, DropdownButton } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MainLayout } from "../../layout/MainLayout";
import LowStockReportScss from './Scss/LowStockReports.module.scss';

function LowStockReports() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [lowStockData, setLowStockData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // Current page
    const itemsPerPage = 10;  // Items per page

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchLowStockData();  // Fetch all data initially
            setLowStockData(data);
        };
        loadData();
    }, []);

    const handleFilter = async () => {
        if (!startDate && !endDate) {
            const data = await fetchLowStockData();
            setLowStockData(data);
        } else {
            const data = await fetchLowStockData(startDate, endDate);
            setLowStockData(data);
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = lowStockData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(lowStockData.length / itemsPerPage);

    // Download PDF function
    const downloadPDF = () => {
        const doc = new jsPDF();

        // Title and Date Range Text
        doc.setFontSize(16); // Larger font for the title
        doc.text("Low Stock Report", 14, 15);

        doc.setFontSize(10); // Set font size for the rest of the document
        doc.text(`Date Range: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, 14, 25);

        const tableHeaders = [
            "No.",
            "Product Name",
            "SKU",
            "Barcode",
            "Qty",
            "Threshold",
            "Status",
            "Date",
        ];

        const tableData = lowStockData.map((entry, index) => [
            index + 1,
            entry.productName,
            entry.sku,
            entry.barcode,
            entry.quantity,
            entry.instockthreshold,
            entry.status,
            new Date(entry.date).toLocaleDateString(), // Format the date for readability
        ]);

        // Adjusting table header font size and column width
        doc.autoTable({
            startY: 35, // Adjust the starting Y position for the table
            head: [tableHeaders],
            body: tableData,
            styles: {
                fontSize: 8, // Smaller font for the table to fit the content
                cellPadding: 3, // Padding for better readability
                halign: 'center', // Horizontal center alignment
                valign: 'middle', // Vertical middle alignment
                overflow: 'linebreak', // Break long words into multiple lines if needed
            },
            columnStyles: {
                0: { cellWidth: 12 },  // No. column width
                1: { cellWidth: 40 },  // Product Name column width
                2: { cellWidth: 25 },  // SKU column width
                3: { cellWidth: 25 },  // Barcode column width
                4: { cellWidth: 15 },  // Quantity column width
                5: { cellWidth: 15 },  // Threshold column width
                6: { cellWidth: 18 },  // Status column width
                7: { cellWidth: 28 },  // Date column width
            },
            tableWidth: 'auto', // Auto-adjust table width to fit content
        });

        const fileName = `LowStockReport_${startDate || "start"}_${endDate || "end"}.pdf`;
        doc.save(fileName);
    };



    // Download XLSX function
    const downloadXLSX = () => {
        const formattedData = lowStockData.map((entry) => ({
            ProductName: entry.productName,
            SKU: entry.sku,
            Barcode: entry.barcode,
            Quantity: entry.quantity,
            Threshold: entry.instockthreshold,
            Status: entry.status,
            Date: entry.date,
        }));

        const wb = XLSX.utils.book_new();
        const dateRange = [
            { A: `Date Range: ${startDate || "N/A"} to ${endDate || "N/A"}` },
        ];
        const header = [
            ["Product Name", "SKU", "Barcode", "Quantity", "Threshold", "Status", "Date"],
        ];
        const data = formattedData.map((entry) =>
            Object.values(entry)
        );

        const sheetData = [...dateRange, [], ...header, ...data];

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        ws["!cols"] = [
            { width: 25 },
            { width: 15 },
            { width: 15 },
            { width: 10 },
            { width: 15 },
            { width: 20 },
            { width: 20 },
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Low Stock Data");
        const fileName = `LowStockReport_${startDate || "start"}_${endDate || "end"}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const handleDownload = (format) => {
        if (format === "PDF") downloadPDF();
        else if (format === "XLSX") downloadXLSX();
    };

    return (
        <MainLayout>
            <div className={LowStockReportScss.Maincomponent}>
                <h1>Low Stock Report</h1>
                <div className={LowStockReportScss.DropDown}>
                    <DropdownButton variant="success" title="Download" id="download-dropdown">
                        <Dropdown.Item onClick={() => handleDownload("PDF")}>PDF</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDownload("XLSX")}>XLSX</Dropdown.Item>
                    </DropdownButton>
                </div>

                <div className={LowStockReportScss.formContent}>
                    <Form>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <div style={{ paddingLeft: 10 }}>
                        <Button onClick={handleFilter} className="mt-3">
                            Filter
                        </Button>
                    </div>
                </div>

                <div className="d-flex justify-content-start align-items-center my-2">
                    <Button
                        variant="link"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        &#8592; {/* Left arrow */}
                    </Button>
                    <span style={{fontSize: '0.9rem'}}>Page {currentPage} of {totalPages}</span>
                    <Button
                        variant="link"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        &#8594; {/* Right arrow */}
                    </Button>
                </div>

                <div className={LowStockReportScss.tables}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Barcode</th>
                                <th>Quantity</th>
                                <th>Threshold</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.sku}</td>
                                    <td>{item.barcode}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.instockthreshold}</td>
                                    <td>{item.status}</td>
                                    <td>{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </MainLayout>
    );
}

export default LowStockReports;
