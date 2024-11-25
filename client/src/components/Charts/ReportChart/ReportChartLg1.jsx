import { useState } from 'react';
import ReportChartcss from './ReportChart.module.scss';
import { fetchSalesData } from '../../../services/SalesReports/SalesQuantity'; // Updated path to the new fetching function
import * as XLSX from 'xlsx'; // For XLSX generation
import jsPDF from 'jspdf'; // For PDF generation

function ReportChartLg1() {
    const [salesData, setSalesData] = useState({ totalQuantity: [], totalSales: [] });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFetchData = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end date.');
            return;
        }
        const data = await fetchSalesData(startDate, endDate); // Fetch with custom date range
        setSalesData(data);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Sales Report", 20, 20);
        doc.text(`From: ${startDate}`, 20, 30);
        doc.text(`To: ${endDate}`, 20, 40);
        doc.text(`Total Quantity: ${salesData.totalQuantity.reduce((a, b) => a + b, 0)}`, 20, 50);
        doc.text(`Total Sales: ${salesData.totalSales.reduce((a, b) => a + b, 0)}`, 20, 60);
        doc.save('sales_report.pdf');
    };

    const handleDownloadXLSX = () => {
        const ws = XLSX.utils.json_to_sheet([
            { "Date Range": `${startDate} to ${endDate}`, "Total Quantity": salesData.totalQuantity.reduce((a, b) => a + b, 0), "Total Sales": salesData.totalSales.reduce((a, b) => a + b, 0) }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
        XLSX.writeFile(wb, 'sales_report.xlsx');
    };

    return (
        <div className={ReportChartcss.containerChartLg1}>
            <h2>Sales Report</h2>
            <div className={ReportChartcss.dateRange}>
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
                <button onClick={handleFetchData}>Fetch Data</button>
            </div>

            <div className={ReportChartcss.chartContainer}>
                {/* Here, you can integrate your chart component */}
            </div>

            <div className={ReportChartcss.downloadButtons}>
                <button onClick={handleDownloadPDF}>Download PDF</button>
                <button onClick={handleDownloadXLSX}>Download XLSX</button>
            </div>
        </div>
    );
}

export default ReportChartLg1;
