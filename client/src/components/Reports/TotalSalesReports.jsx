import { useState, useEffect } from 'react';
import { Table, Dropdown, Button } from 'react-bootstrap';
import { format } from 'date-fns'; // for date formatting
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Importing the jspdf-autotable plugin
import { fetchTransactions } from './Service/TotalSales'; // Import the fetch function
import { MainLayout } from '../../layout/MainLayout'
import TotalSalesReportScss from './Scss/TotalSalesReports.module.scss';
import { Spinner } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap'; // Import Pagination


function TotalSalesReports() {
    const [transactionData, setTransactionData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Number of rows per page

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    // Fetch data from Firebase on component mount
    useEffect(() => {
        const getData = async () => {
            const data = await fetchTransactions();
            setTransactionData(data);
            setFilteredData(data); // Set all data as default
        };

        // Clear date inputs on reload
        setStartDate('');
        setEndDate('');

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
            const endOfDayTimestamp = new Date(endDate).setHours(23, 59, 59, 999);
            const filtered = transactionData.filter(transaction => {
                const transactionDate = convertToTimestamp(transaction.date);
                return (
                    transactionDate >= convertToTimestamp(startDate) &&
                    transactionDate <= endOfDayTimestamp
                );
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(transactionData); // Reset to all data if no filter
        }
    };

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true); // Start loading
            const data = await fetchTransactions();
            setTransactionData(data);
            setFilteredData(data); // Set all data as default
            setIsLoading(false); // Stop loading once data is fetched
        };

        getData();
    }, []);




    // Handle XLSX file download
    const downloadXlsx = () => {
        // Create a worksheet from the filtered data
        const ws = XLSX.utils.json_to_sheet(filteredData);
        // Style header cells (bold font, centered text)
        const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'];
        headerCells.forEach(cell => {
            if (ws[cell]) {
                ws[cell].s = { font: { bold: true } };  // Make text bold
            }
        });

        // Add total row at the bottom in vertical format
        const totals = [
            ['Total Quantity Sold', totalQuantitySold],
            ['Total Revenue', `${totalRevenue.toFixed(2)}`],
            ['Total Discount', `${totalDiscount.toFixed(2)}`],
            ['Total Tax', `${totalTax.toFixed(2)}`],
            ['Net Revenue', `${netRevenue.toFixed(2)}`],
        ];

        // Append totals to the sheet, starting at the row below the last data row
        XLSX.utils.sheet_add_aoa(ws, totals, { origin: -1 });

        // Create a new workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

        // Write the workbook to an array (XLSX format)
        const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Save the XLSX file
        const blob = new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Sales_Report_${startDate || 'All'}_to_${endDate || 'All'}.xlsx`;
        link.click();
    };

    // Handle PDF file download in landscape orientation
    const downloadPdf = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set orientation to landscape
        });

        // Title and Date Range
        doc.setFontSize(16);
        doc.text('Total Sales Report', 14, 20);
        doc.setFontSize(10);

        // If no startDate or endDate, display "All"
        const displayStartDate = startDate ? startDate : 'All';
        const displayEndDate = endDate ? endDate : 'All';
        doc.text(`From: ${displayStartDate} To: ${displayEndDate}`, 14, 30);

        // Table with custom styles
        doc.autoTable({
            head: [['Transaction ID', 'Date', 'Total Quantity', 'Discount', 'Tax', 'Total']],
            body: filteredData.map(transaction => [
                transaction.transactionId,
                transaction.date,
                transaction.totalQuantity,
                transaction.discount,
                transaction.tax,
                transaction.total,
            ]),
            startY: 40,
            theme: 'grid', // Adds a grid style to the table
            headStyles: {
                fillColor: [255, 0, 0], // Red header
                textColor: [255, 255, 255], // White text
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: [0, 0, 0], // Black text
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245], // Light gray for alternating rows
            },
        });

        // Footer with totals
        doc.text(`Total Quantity Sold: ${totalQuantitySold}`, 14, doc.lastAutoTable.finalY + 10);
        doc.text(`Total Revenue: ${totalRevenue.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 15);
        doc.text(`Total Discounts: ${totalDiscount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
        doc.text(`Total Tax: ${totalTax.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 25);
        doc.text(`Net Revenue: ${netRevenue.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 30);

        // Save the PDF
        doc.save(`SalesReport_${startDate || 'All'}_to_${endDate || 'All'}.pdf`);
    };



    // Calculate totals
    const totalQuantitySold = filteredData.reduce((acc, item) => acc + item.totalQuantity, 0);
    const totalRevenue = filteredData.reduce((acc, item) => acc + parseFloat(item.total), 0);
    const totalDiscount = filteredData.reduce((acc, item) => acc + parseFloat(item.discount), 0);
    const totalTax = filteredData.reduce((acc, item) => acc + parseFloat(item.tax), 0);
    const netRevenue = totalRevenue - totalDiscount + totalTax;

    return (

        <MainLayout>
            <div className={TotalSalesReportScss.Mcontainer}>
                <h1>Total Sales</h1>
                {/* Dropdown for file download */}
                <Dropdown className={TotalSalesReportScss.DropDown}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Download
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={downloadXlsx}>XLSX</Dropdown.Item>
                        <Dropdown.Item onClick={downloadPdf}>PDF</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Date Picker Inputs */}
                <div className={TotalSalesReportScss.DatePicker}>
                    <div>
                        <p className='m-0 p-0'>Start Date:</p>
                        <input
                            type="date"
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                        />
                    </div>
                    <div>
                        <p className='m-0 p-0'>End Date: </p>
                        <input
                            type="date"
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                        />
                    </div>
                </div>

                <Button onClick={filterData}>Filter Date</Button>

                <div className={TotalSalesReportScss.TableContainer}>
                    {isLoading ? (
                        <div className="d-flex justify-content-center mt-5">
                            <Spinner animation="grow" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Transaction ID</th>
                                        <th>Date/Time</th>
                                        <th>Qty.</th>
                                        <th>Disc</th>
                                        <th>Tax</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map(transaction => (
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
                                        <td colSpan="2">Totals:</td>
                                        <td>{totalQuantitySold}</td>
                                        <td>{`₱${totalDiscount.toFixed(2)}`}</td>
                                        <td>{`₱${totalTax.toFixed(2)}`}</td>
                                        <td>{`₱${totalRevenue.toFixed(2)}`}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5">Net Revenue</td>
                                        <td>{`₱${netRevenue.toFixed(2)}`}</td>
                                    </tr>
                                </tfoot>
                            </Table>
                            {/* Pagination */}
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination>
                                    <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1}/>
                                    <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                    {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map(num => (
                                        <Pagination.Item
                                            key={num + 1}
                                            active={num + 1 === currentPage}
                                            onClick={() => paginate(num + 1)}
                                        >
                                            {num + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                                    />
                                    <Pagination.Last
                                        onClick={() => paginate(Math.ceil(filteredData.length / itemsPerPage))}
                                        disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                                    />
                                </Pagination>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>



    );
}

export default TotalSalesReports;
