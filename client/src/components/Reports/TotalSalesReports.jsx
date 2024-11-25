import { useState, useEffect } from 'react';
import { Table, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/database';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

function TotalSalesReports() {
    const [transactions, setTransactions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalDiscounts, setTotalDiscounts] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [netRevenue, setNetRevenue] = useState(0);

    useEffect(() => {
        // Fetch data from Firebase
        firebase.database().ref('TransactionHistory').on('value', (snapshot) => {
            const data = snapshot.val();
            const transactionsArray = [];
            for (let id in data) {
                transactionsArray.push({ id, ...data[id] });
            }
            setTransactions(transactionsArray);
        });
    }, []);

    const filterData = () => {
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transactionDate >= start && transactionDate <= end;
        });

        setFilteredData(filtered);
        calculateTotals(filtered);
    };

    const calculateTotals = (data) => {
        let qty = 0;
        let revenue = 0;
        let discounts = 0;
        let tax = 0;
        let net = 0;

        data.forEach((transaction) => {
            qty += parseInt(transaction.totalQuantity);
            revenue += parseFloat(transaction.total);
            discounts += parseFloat(transaction.discount);
            tax += parseFloat(transaction.tax);
            net += (parseFloat(transaction.total) - parseFloat(transaction.discount) + parseFloat(transaction.tax));
        });

        setTotalQuantity(qty);
        setTotalRevenue(revenue);
        setTotalDiscounts(discounts);
        setTotalTax(tax);
        setNetRevenue(net);
    };

    const handleDownload = (format) => {
        if (format === 'pdf') {
            const doc = new jsPDF();
            doc.autoTable({
                head: [['Transaction ID', 'Date', 'Total Quantity', 'Discount', 'Tax', 'Total']],
                body: filteredData.map((item) => [
                    item.id,
                    item.date,
                    item.totalQuantity,
                    item.discount,
                    item.tax,
                    item.total,
                ]),
            });
            doc.save('sales-report.pdf');
        } else if (format === 'xlsx') {
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
            XLSX.writeFile(workbook, 'sales-report.xlsx');
        }
    };

    return (
        <div>
            <h1>Total Sales</h1>

            <div className="mb-4">
                <label>Start Date:</label>
                <input type="date" onChange={(e) => setStartDate(e.target.value)} />
                <label>End Date:</label>
                <input type="date" onChange={(e) => setEndDate(e.target.value)} />
                <Button onClick={filterData}>Filter</Button>
            </div>

            <div className="mb-4">
                <DropdownButton id="dropdown-basic-button" title="Download Report">
                    <Dropdown.Item onClick={() => handleDownload('pdf')}>Download PDF</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDownload('xlsx')}>Download XLSX</Dropdown.Item>
                </DropdownButton>
            </div>

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
                    {filteredData.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.totalQuantity}</td>
                            <td>{transaction.discount}</td>
                            <td>{transaction.tax}</td>
                            <td>{transaction.total}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div>
                <h4>Report Summary</h4>
                <p>Total Quantity Sold: {totalQuantity}</p>
                <p>Total Revenue: ₱{totalRevenue.toFixed(2)}</p>
                <p>Discounts Applied: ₱{totalDiscounts.toFixed(2)}</p>
                <p>Tax Collected: ₱{totalTax.toFixed(2)}</p>
                <p>Net Revenue: ₱{netRevenue.toFixed(2)}</p>
            </div>
        </div>
    );
}

export default TotalSalesReports;
