import { useState, useEffect } from 'react';
import { Table, Dropdown, Button } from 'react-bootstrap';
import { format } from 'date-fns'; // for date formatting
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { fetchTransactions } from './Service/TotalSales'; // Import the fetch function

function TotalSalesReports() {
    const [transactionData, setTransactionData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    // Fetch data from Firebase on component mount
    useEffect(() => {
        const getData = async () => {
            const data = await fetchTransactions();
            setTransactionData(data);
        };
        getData();
    }, []);

    // Format date as timestamp for comparison
    const convertToTimestamp = (dateString) => {
        const date = new Date(dateString);
        return date.getTime();
    };

    // Filter the data based on start and end dates
    const filterData = () => {
        if (startDate && endDate) {
            const filtered = transactionData.filter(transaction => {
                const transactionDate = convertToTimestamp(transaction.date);
                return (
                    transactionDate >= convertToTimestamp(startDate) &&
                    transactionDate <= convertToTimestamp(endDate)
                );
            });
            setFilteredData(filtered);
        }
    };

    // Handle file download (XLSX or PDF)
    const handleDownload = (type) => {
        if (type === 'xlsx') {
            const ws = XLSX.utils.json_to_sheet(filteredData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
            const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([xlsxData]), 'sales_report.xlsx');
        } else if (type === 'pdf') {
            const doc = new jsPDF();
            doc.autoTable({
                head: [['Transaction ID', 'Date', 'Total Quantity', 'Discount', 'Tax', 'Total']],
                body: filteredData.map(transaction => [
                    transaction.transactionId,
                    transaction.date,
                    transaction.totalQuantity,
                    `₱${transaction.discount}`,
                    `₱${transaction.tax}`,
                    `₱${transaction.total}`,
                ]),
            });
            doc.save('sales_report.pdf');
        }
    };

    // Calculate totals
    const totalQuantitySold = filteredData.reduce((acc, item) => acc + item.totalQuantity, 0);
    const totalRevenue = filteredData.reduce((acc, item) => acc + parseFloat(item.total), 0);
    const totalDiscount = filteredData.reduce((acc, item) => acc + parseFloat(item.discount), 0);
    const totalTax = filteredData.reduce((acc, item) => acc + parseFloat(item.tax), 0);
    const netRevenue = totalRevenue - totalDiscount + totalTax;

    return (
        <div>
            <div>
                <h1>Total Sales</h1>
                {/* Date Picker Inputs */}
                <div>
                    <input
                        type="date"
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                    />
                    <Button onClick={filterData}>Filter</Button>
                </div>

                {/* Dropdown for file download */}
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Download Report
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleDownload('xlsx')}>Download as XLSX</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDownload('pdf')}>Download as PDF</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Total Quantity</th>
                            <th>Discount</th>
                            <th>Tax</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(transaction => (
                            <tr key={transaction.transactionId}>
                                <td>{transaction.transactionId}</td>
                                <td>{format(new Date(transaction.date), 'MMM dd, yyyy, h:mm a')}</td>
                                <td>{transaction.totalQuantity}</td>
                                <td>{`₱${transaction.discount}`}</td>
                                <td>{`₱${transaction.tax}`}</td>
                                <td>{`₱${transaction.total}`}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2">Total Quantity Sold</td>
                            <td>{totalQuantitySold}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Total Revenue</td>
                            <td>{`₱${totalRevenue.toFixed(2)}`}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Discounts Applied</td>
                            <td>{`₱${totalDiscount.toFixed(2)}`}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Tax Collected</td>
                            <td>{`₱${totalTax.toFixed(2)}`}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Net Revenue</td>
                            <td>{`₱${netRevenue.toFixed(2)}`}</td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
}

export default TotalSalesReports;
