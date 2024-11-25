import { useState, useEffect } from 'react';
import { fetchTotalSales } from './path/to/your/fetchFunction'; // adjust path accordingly

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

    const handleDownload = (format) => {
        // Add functionality to download the report in PDF or XLSX format
        // You can use libraries like jsPDF for PDF or xlsx for XLSX generation
    };

    useEffect(() => {
        // Fetch sales data when component mounts or date changes
        handleDateChange();
    }, [startDate, endDate]);

    return (
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
                                <td>{transaction.paymentAmount}</td>
                                <td>{transaction.tax}</td>
                                <td>{transaction.totalQuantity}</td>
                                <td>{transaction.total}</td>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Total Sales: {totalSales}</h3>
                <button onClick={() => handleDownload('pdf')}>Download PDF</button>
                <button onClick={() => handleDownload('xlsx')}>Download XLSX</button>
            </div>
        </div>
    );
}

export default TotalSalesReports;
