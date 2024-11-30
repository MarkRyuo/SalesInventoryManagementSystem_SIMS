import { useState, useEffect } from 'react';
import Chartcss from './Charts.module.scss';
import { fetchSalesData } from '../../../services/Fetching/SalesServices';  // Import fetchSalesData function
import { Line } from 'react-chartjs-2'; // Import Line from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary chart.js components

// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Function to format the date (e.g., "Oct 01")
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { day: '2-digit', month: 'short' });  // 'Oct 01' format
};

function ChartLg3() {
    const [salesData, setSalesData] = useState({ totalSales: [], dates: [] });
    const [selectedRange, setSelectedRange] = useState('today');  // Default to 'today'

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
        labels: salesData.dates.map(date => formatDate(date)),  // Format the dates
        datasets: [
            {
                label: 'Total Sales (₱)',
                data: salesData.totalSales, // Sales data
                borderColor: 'rgba(170, 201, 255, 1)',
                backgroundColor: 'rgba(170, 201, 255, 0.2)',
                fill: true,
                tension: 0.4, // Smooth lines
            }
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,  // Ensures the chart is responsive
        maintainAspectRatio: false,  // Allow the chart to adjust to container size
        scales: {
            x: {
                ticks: {
                    autoSkip: true,  // Skip some labels if necessary
                    maxRotation: 45,  // Rotate labels to 45 degrees for better readability
                    minRotation: 45,  // Maintain the 45 degrees rotation
                    padding: 10,  // Space between labels
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (₱)',  // Y-axis label
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
                        return `${label}: ₱${value.toLocaleString()}`;  // Format the value with a currency symbol
                    },
                },
            },
        },
    };

    return (
        <div className={Chartcss.containerChartLg3}>
            {/* Render the Line chart here */}
            <div className={Chartcss.rangeButtons}>
                <select onChange={(e) => handleRangeChange(e.target.value)} defaultValue="today" className='form-select'>
                    <option value="today">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default ChartLg3;
