import { useState } from 'react';
import { fetchTotalSales } from './Service/TotalSales'; // Adjust the path accordingly
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';  // Update this line
import { MainLayout } from '../../layout/MainLayout';
import { Table, Button, Dropdown } from 'react-bootstrap'; // Import Dropdown from React-Bootstrap

function TotalSalesReports() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [isLoading, setIsLoading] = useState(false);  // Add loading state

    const handleDateChange = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        setIsLoading(true);  // Start loading
        const { filteredTransactions, totalSales } = await fetchTotalSales(startDate, endDate);
        setFilteredTransactions(filteredTransactions);
        setTotalSales(totalSales);
        setIsLoading(false);  // Stop loading
    };

    const formatPeso = (amount) => {
        return `₱${parseFloat(amount).toFixed(2)}`;
    };

    const calculateTotals = () => {
        let totalQuantity = 0;
        let totalRevenue = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        // Calculate totals based on the filtered transactions
        filteredTransactions.forEach(transaction => {
            totalQuantity += transaction.totalQuantity;
            totalRevenue += parseFloat(transaction.total) || 0;  // Ensure total is a number
            totalDiscount += parseFloat(transaction.discount) || 0;  // Assuming the discount is in the transaction
            totalTax += parseFloat(transaction.tax) || 0;  // Ensure tax is a number
        });

        const netRevenue = totalRevenue - totalDiscount - totalTax;
        return { totalQuantity, totalRevenue, totalDiscount, totalTax, netRevenue };
    };


    const downloadPDF = () => {
        const { totalQuantity, totalRevenue, totalDiscount, totalTax, netRevenue } = calculateTotals();

        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Sales Report - Total Sales", 10, 10);

        // Add the date range to the PDF
        const dateRange = `From: ${startDate} To: ${endDate}`;
        doc.text(dateRange, 10, 20);

        const tableData = filteredTransactions.map((entry) => {
            const item = entry.items[0] || {};  // Assuming the first item in the array is what we need
            return [
                item.productName || 'N/A',  // Access productName from the first item
                entry.totalQuantity.toString() || '0',
                formatPeso(item.price) || '₱0.00',  // Access price from the first item
                (Number(entry.discount) || 0).toFixed(2),
                (Number(entry.tax) || 0).toFixed(2),
                formatPeso(entry.total) || '₱0.00',
            ];
        });

        doc.autoTable({
            head: [["Product Name", "Total Quantity", "Price", "Discount", "Tax", "Total"]],
            body: tableData,
            startY: 30,
        });

        const totalY = doc.previousAutoTable.finalY + 10;
        doc.text(`Total Quantity Sold: ${totalQuantity}`, 10, totalY);
        doc.text(`Total Revenue: ${formatPeso(totalRevenue)}`, 10, totalY + 10);
        doc.text(`Discounts Applied: ${formatPeso(totalDiscount)}`, 10, totalY + 20);
        doc.text(`Tax Collected: ${formatPeso(totalTax)}`, 10, totalY + 30);
        doc.text(`Net Revenue: ${formatPeso(netRevenue)}`, 10, totalY + 40);

        doc.save(`sales_report_quantity_sold_${startDate}_to_${endDate}.pdf`);
    };


    const downloadXLSX = () => {
        const { totalQuantity, totalRevenue, totalDiscount, totalTax, netRevenue } = calculateTotals();

        const formattedData = filteredTransactions.map((entry) => {
            const item = entry.items[0] || {};  // Assuming the first item in the array is what we need
            return {
                ProductName: item.productName || 'N/A',  // Access productName from the first item
                TotalQuantity: entry.totalQuantity || 0,
                Price: formatPeso(item.price) || '₱0.00',  // Access price from the first item
                Discount: (Number(entry.discount) || 0).toFixed(2),
                Tax: (Number(entry.tax) || 0).toFixed(2),
                Total: formatPeso(entry.total) || '₱0.00',
            };
        });

        formattedData.push({
            TotalQuantitySold: totalQuantity,
            TotalRevenue: formatPeso(totalRevenue),
            DiscountsApplied: formatPeso(totalDiscount),
            TaxCollected: formatPeso(totalTax),
            NetRevenue: formatPeso(netRevenue),
        });

        // Include the date range as the first row in the sheet
        const dateRangeRow = [`Date Range: From ${startDate} to ${endDate}`];
        const ws = XLSX.utils.json_to_sheet(formattedData, { header: ["ProductName", "TotalQuantity", "Price", "Discount", "Tax", "Total"] });
        XLSX.utils.sheet_add_aoa(ws, [dateRangeRow], { origin: 'A1' });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        XLSX.writeFile(wb, `sales_report_quantity_sold_${startDate}_to_${endDate}.xlsx`);
    };




    return (
        <MainLayout>
            <div>
                <h1>Total Sales</h1>

                <div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                    />
                    <Button onClick={handleDateChange} disabled={isLoading}>Filter</Button>
                </div>

                <div>
                    {isLoading ? (
                        <p>Loading data...</p>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Customer Name</th>
                                    <th>Discount</th>
                                    <th>Amount</th>
                                    <th>Tax</th>
                                    <th>Total Quantity</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.id}</td>
                                            <td>{transaction.customerName}</td>
                                            <td>{(Number(transaction.discountPercentage) || 0).toFixed(2)}%</td>
                                            <td>{formatPeso(transaction.paymentAmount)}</td>
                                            <td>{(Number(transaction.tax) || 0).toFixed(2)}</td>
                                            <td>{transaction.totalQuantity}</td>
                                            <td>{formatPeso(transaction.total)}</td>
                                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No transactions available. Please apply a filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </div>

                {filteredTransactions.length > 0 && (
                    <div>
                        <h3>Total Sales: {formatPeso(totalSales)}</h3>

                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-custom-components">
                                Download Report
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item as="button" onClick={downloadPDF}>
                                    Download PDF
                                </Dropdown.Item>
                                <Dropdown.Item as="button" onClick={downloadXLSX}>
                                    Download XLSX
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default TotalSalesReports;
