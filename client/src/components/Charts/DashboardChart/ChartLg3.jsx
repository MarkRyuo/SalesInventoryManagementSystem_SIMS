import { useState, useEffect } from 'react';
import Chartcss from './Charts.module.scss';
import { fetchSalesData } from '../../../services/Fetching/SalesServices';  // Import fetchSalesData function
import { Line } from 'react-chartjs-2'; // Import Line from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary chart.js components

// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ChartLg3() {
    const [salesData, setSalesData] = useState({ totalQuantity: [], totalSales: [] });
    const [selectedRange, setSelectedRange] = useState('month');  // Default to 'month'

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch sales data for the selected range
                const data = await fetchSalesData(selectedRange);
                setSalesData(data);  // Set the sales data for the graph
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };

        fetchData();  // Fetch data when the component mounts or when the range changes
    }, [selectedRange]);

    // Handle range selection (Today, Week, Month, Year)
    const handleRangeChange = (range) => {
        setSelectedRange(range);  // Update the range
    };

    // Chart data setup
    const chartData = {
        labels: Array(salesData.totalSales.length).fill(''), // Labels (empty, as they could be days, weeks, etc.)
        datasets: [
            {
                label: 'Total Sales (₱)',
                data: salesData.totalSales, // Sales data
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4, // Smooth lines
            },
            {
                label: 'Total Quantity',
                data: salesData.totalQuantity, // Quantity data
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                tension: 0.4, // Smooth lines
            }
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (₱) and Quantity',
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}: ₱${value.toLocaleString()}`;
                    },
                },
            },
        },
    };

    return (
        <div className={Chartcss.containerChartLg3}>
            <div className={Chartcss.rangeButtons}>
                <button onClick={() => handleRangeChange('today')}>Today</button>
                <button onClick={() => handleRangeChange('week')}>Week</button>
                <button onClick={() => handleRangeChange('month')}>Month</button>
                <button onClick={() => handleRangeChange('year')}>Year</button>
            </div>
            {/* Render the Line chart here */}
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default ChartLg3;
