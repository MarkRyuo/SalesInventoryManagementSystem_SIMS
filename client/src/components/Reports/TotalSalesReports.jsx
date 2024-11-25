import { useState } from 'react';
import fetchTotalSalesReport from './fetchTotalSalesReport';

function TotalSalesReports() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salesData, setSalesData] = useState([]);

    const handleFetch = async () => {
        try {
            const data = await fetchTotalSalesReport(startDate, endDate);
            setSalesData(data);
        } catch (error) {
            console.error("Error fetching sales report:", error);
        }
    };

    return (
        <div>
            <div>
                <h1>Total Sales</h1>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={handleFetch}>Filter</button>
                {/* Dropdown for PDF/XLSX export */}
                <select>
                    <option value="pdf">Download PDF</option>
                    <option value="xlsx">Download XLSX</option>
                </select>
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total Quantity</th>
                            <th>Discount</th>
                            <th>Tax</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.date}</td>
                                <td>{transaction.totalQuantity}</td>
                                <td>{transaction.discount}</td>
                                <td>{transaction.tax}</td>
                                <td>₱{transaction.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TotalSalesReports;
