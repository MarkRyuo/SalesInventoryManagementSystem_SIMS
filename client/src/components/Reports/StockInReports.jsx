import { useState, useEffect } from "react";
import { fetchAllStockIn } from "./Service/StockIn"; // Import the helper function for fetching stock
import { Button, Table, Form, Dropdown, DropdownButton } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { MainLayout } from "../../layout/MainLayout";
import StockInReportsScss from './Scss/StockInReports.module.scss';

function StockInReports() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [allData, setAllData] = useState([]);

    useEffect(() => {
        // Fetch all data when the component is mounted
        const fetchAllData = async () => {
            try {
                const data = await fetchAllStockIn();
                setAllData(data);
                setFilteredData(data); // Initially display all data
            } catch (error) {
                console.error("Error fetching all stock data:", error);
            }
        };

        fetchAllData();
    }, []);

    const fetchFilteredData = () => {
        if (startDate && endDate) {
            const filtered = allData.filter(item => {
                const entryDate = new Date(item.addedQuantityHistory.date);
                return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(allData); // If no date filter, show all data
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Add the report title and date range
        doc.setFontSize(16);
        doc.text("Stock In Report", 14, 20);
        doc.setFontSize(12);
        doc.text(`Date Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`, 14, 30);

        // Create the table with the data
        doc.autoTable({
            startY: 40,
            head: [['Product ID', 'Product Name', 'SKU', 'Barcode', 'Quantity', 'Date Added']],
            body: filteredData.map(item => [
                item.productId,
                item.productName,
                item.sku,
                item.barcode,
                item.addedQuantityHistory.quantity,
                new Date(item.addedQuantityHistory.date).toLocaleDateString(),
            ]),
        });

        // Save the PDF
        doc.save('stock-in-report.pdf');
    };

    const handleDownloadXLSX = () => {
        // Prepare data for the XLSX file
        const reportData = filteredData.map(item => ({
            ProductID: item.productId,
            ProductName: item.productName,
            SKU: item.sku,
            Barcode: item.barcode,
            Quantity: item.addedQuantityHistory.quantity,
            DateAdded: new Date(item.addedQuantityHistory.date).toLocaleDateString(),
        }));

        // Add title and date range to the worksheet
        const title = `Stock In Report (Date Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()})`;
        const worksheet = XLSX.utils.json_to_sheet(reportData);

        // Add title as the first row
        const wsTitle = XLSX.utils.aoa_to_sheet([[title]]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, wsTitle, "Report Title");
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock In Report");

        // Write the file
        XLSX.writeFile(workbook, "stock-in-report.xlsx");
    };

    return (
        <MainLayout>
            <div className={StockInReportsScss.Maincomponent}>
                <h1>Stock In Report</h1>
                {/* Dropdown for Download Options */}
                <div className={StockInReportsScss.DropDown}>
                    <DropdownButton variant="success" title="Download" id="download-dropdown">
                        <Dropdown.Item as="button" onClick={handleDownloadPDF}>PDF</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={handleDownloadXLSX}>XLSX</Dropdown.Item>
                    </DropdownButton>
                </div>
                {/* Date Range Filter */}
                <div className={StockInReportsScss.formContent}>
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
                        <Button variant="primary" onClick={fetchFilteredData}>Filter</Button>
                    </div>
                </div>

                {/* Table Display */}
                <div className={StockInReportsScss.tables}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Barcode</th>
                                <th>Quantity</th>
                                <th>Date Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productId}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.sku}</td>
                                    <td>{item.barcode}</td>
                                    <td>{item.addedQuantityHistory.quantity}</td>
                                    <td>{new Date(item.addedQuantityHistory.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </MainLayout>
    );
}

export default StockInReports;
