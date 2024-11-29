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
        doc.setFontSize(12);
        doc.text("Low Stock Report", 10, 10);
        doc.text(`Date Range: ${startDate || "N/A"} to ${endDate || "N/A"}`, 10, 20);

        const tableHeaders = [
            "No.",
            "Product Name",
            "SKU",
            "Barcode",
            "Quantity",
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
            entry.date,
        ]);

        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 30,
            theme: "grid",
            margin: { top: 20 },
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
                <h1>Stock Status Report</h1>
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
                        <tfoot>
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center" }}>
                                        <Button
                                            variant="link"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)} // Use setCurrentPage directly
                                        >
                                            &#8592; {/* Left arrow */}
                                        </Button>
                                        <span>Page {currentPage} of {totalPages}</span>
                                        <Button
                                            variant="link"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)} // Use setCurrentPage directly
                                        >
                                            &#8594; {/* Right arrow */}
                                        </Button>
                                </td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        </MainLayout>
    );
}

export default LowStockReports;
