import { useState, useEffect } from 'react';
import { fetchTotalSales } from './yourFirebaseFunctions'; // Import the fetch function for total sales
import DatePicker from 'react-datepicker'; // For date range picker
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from "jspdf"; // For PDF download
import * as XLSX from "xlsx"; // For XLSX download

function TotalSales() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        const fetchSales = async () => {
            const { filteredTransactions, totalSales } = await fetchTotalSales(startDate, endDate);
            setSalesData(filteredTransactions);
            setTotalSales(totalSales);
        };
        fetchSales();
    }, [startDate, endDate]);

    // PDF Download
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Total Sales Report", 10, 10);
        doc.text(`Total Sales: ${totalSales}`, 10, 20);
        // Add table data (you can customize this)
        const tableData = salesData.map(item => [item.id, item.customerName, item.totalQuantity, item.total]);
        doc.autoTable({
            head: [['Transaction ID', 'Customer', 'Quantity', 'Total']],
            body: tableData,
        });
        doc.save("total_sales_report.pdf");
    };

    // XLSX Download
    const downloadXLSX = () => {
        const ws = XLSX.utils.json_to_sheet(salesData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Total Sales");
        XLSX.writeFile(wb, "total_sales_report.xlsx");
    };

    return (
        <div>
            <div>
                <h1>Total Sales</h1>
                <div>
                    {/* Date range picker for filtering */}
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        placeholderText="Start Date"
                        dateFormat="yyyy-MM-dd"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        placeholderText="End Date"
                        dateFormat="yyyy-MM-dd"
                    />
                </div>
                <div>
                    {/* Download buttons */}
                    <button onClick={downloadPDF}>Download PDF</button>
                    <button onClick={downloadXLSX}>Download XLSX</button>
                </div>
            </div>

            <div>
                {/* Table to display sales data */}
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Customer</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.length > 0 ? (
                            salesData.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.customerName}</td>
                                    <td>{item.totalQuantity}</td>
                                    <td>{item.total}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>Total Sales: {totalSales}</div>
            </div>
        </div>
    );
}

export default TotalSales;
