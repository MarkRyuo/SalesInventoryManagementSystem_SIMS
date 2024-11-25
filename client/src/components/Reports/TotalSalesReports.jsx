/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { fetchTotalSales } from './Service/TotalSales'; // Adjust the path accordingly
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import XLSX from 'xlsx';

function TotalSalesReports() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [totalSales, setTotalSales] = useState(0);

    const handleDateChange = async () => {
        const { filteredTransactions, totalSales } = await fetchTotalSales(startDate, endDate);
        setFilteredTransactions(filteredTransactions);
        setTotalSales(totalSales);
    };

    const formatPeso = (amount) => {
        return `₱${parseFloat(amount).toFixed(2)}`;
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Sales Report - Total Sales", 10, 10);

        const tableData = filteredTransactions.map((entry) => [
            entry.id,
            entry.customerName,
            entry.discountPercentage.toString(),
            formatPeso(entry.paymentAmount),
            formatPeso(entry.tax),
            entry.totalQuantity.toString(),
            formatPeso(entry.total),
        ]);

        doc.autoTable({
            head: [["Transaction ID", "Customer Name", "Discount", "Amount", "Tax", "Total Quantity", "Total"]],
            body: tableData,
            startY: 20,
        });

        const totalY = doc.previousAutoTable.finalY + 10;
        doc.text(`Total Sales: ${formatPeso(totalSales)}`, 10, totalY);

        doc.save("sales_report_total_sales.pdf");
    };

    const downloadXLSX = () => {
        const formattedData = filteredTransactions.map((entry) => ({
            TransactionID: entry.id,
            CustomerName: entry.customerName,
            Discount: entry.discountPercentage,
            Amount: formatPeso(entry.paymentAmount),
            Tax: formatPeso(entry.tax),
            TotalQuantity: entry.totalQuantity,
            Total: formatPeso(entry.total),
        }));

        formattedData.push({
            TotalSales: formatPeso(totalSales),
        });

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        XLSX.writeFile(wb, "sales_report_total_sales.xlsx");
    };

    useEffect(() => {
        // Fetch sales data when component mounts or date changes
        handleDateChange();
    }, [startDate, endDate]);

    return (
        <MainLayout

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
                <button onClick={handleDateChange}>Filter</button>
            </div>

            <div>
                <table>
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
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.customerName}</td>
                                <td>{transaction.discountPercentage}%</td>
                                <td>{formatPeso(transaction.paymentAmount)}</td>
                                <td>{formatPeso(transaction.tax)}</td>
                                <td>{transaction.totalQuantity}</td>
                                <td>{formatPeso(transaction.total)}</td>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Total Sales: {formatPeso(totalSales)}</h3>
                <button onClick={downloadPDF}>Download PDF</button>
                <button onClick={downloadXLSX}>Download XLSX</button>
            </div>
        </div>
    );
}

export default TotalSalesReports;
