import { useState } from "react";
import { fetchLowStockData } from "./Service/LowStock";
import { Button, Table, Form, Dropdown, DropdownButton } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MainLayout } from "../../layout/MainLayout";
import LowStockReportScss from './Scss/LowStockReports.module.scss'

function LowStockReports() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [lowStockData, setLowStockData] = useState([]);

    // Handle date filter
    const handleFilter = async () => {
        const data = await fetchLowStockData(startDate, endDate);
        setLowStockData(data);
    };

    // Download PDF function
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        // Add title and date range
        doc.text("Filtered Stock In Data", 10, 10);
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

        // Add date range to the top row
        const dateRange = [
            { A: `Date Range: ${startDate || "N/A"} to ${endDate || "N/A"}` },
        ];
        const header = [
            ["Product Name", "SKU", "Barcode", "Quantity", "Threshold", "Status", "Date"],
        ];
        const data = formattedData.map((entry) =>
            Object.values(entry)
        );

        // Combine date range, header, and data
        const sheetData = [...dateRange, [], ...header, ...data];

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        // Adjust column widths
        ws["!cols"] = [
            { width: 25 },
            { width: 15 },
            { width: 15 },
            { width: 10 },
            { width: 15 },
            { width: 20 },
            { width: 20 },
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Stock In Data");

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
                {/* Download Buttons */}
                <div className={LowStockReportScss.DropDown}>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title="Download"
                        variant="success"
                    >
                        <Dropdown.Item onClick={() => handleDownload("PDF")}>
                            PDF
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDownload("XLSX")}>
                            XLSX
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
                <div className={LowStockReportScss.formContent}>
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
                    <div style={{ padding: 10 }}>
                        <Button onClick={handleFilter} className="mt-3">
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Scrollable Table */}
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
                            {lowStockData.map((item, index) => (
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
