import { useState } from 'react';
import { fetchTotalSales } from './path-to-your-service';  // Adjust the import path
import { saveAs } from 'file-saver';  // For XLSX export
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

function TotalSaless() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [totalSales, setTotalSales] = useState(0);

    // Handle date change
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    // Fetch filtered sales
    const handleFilterSales = async () => {
        try {
            const { filteredTransactions, totalSales } = await fetchTotalSales(startDate, endDate);
            setFilteredTransactions(filteredTransactions);
            setTotalSales(totalSales);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    // Handle PDF download
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Sales Report', 10, 10);
        doc.text(`Total Sales: ${totalSales}`, 10, 20);
        filteredTransactions.forEach((transaction, index) => {
            doc.text(`${transaction.customerName} - ${transaction.total}`, 10, 30 + index * 10);
        });
        doc.save('sales-report.pdf');
    };

    // Handle XLSX download
    const handleDownloadXLSX = () => {
        const ws = XLSX.utils.json_to_sheet(filteredTransactions);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelFile = new Blob([excelBuffer], { bookType: 'xlsx', type: 'application/octet-stream' });
        saveAs(excelFile, 'sales-report.xlsx');
    };

    return (
        <div>
            <h1>Total Sales</h1>

            {/* Date Filter */}
            <div>
                <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleDateChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleDateChange}
                />
                <button onClick={handleFilterSales}>Filter</button>
            </div>

            <div>
                <button onClick={handleDownloadPDF}>Download PDF</button>
                <button onClick={handleDownloadXLSX}>Download XLSX</button>
            </div>

            {/* Table */}
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Total Quantity</th>
                            <th>Total Amount</th>
                            <th>Discount</th>
                            <th>Tax</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.customerName}</td>
                                    <td>{transaction.totalQuantity}</td>
                                    <td>{transaction.total}</td>
                                    <td>{transaction.discountPercentage}%</td>
                                    <td>{transaction.tax}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <p>Total Sales: {totalSales}</p>
            </div>
        </div>
    );
}

export default TotalSaless;
