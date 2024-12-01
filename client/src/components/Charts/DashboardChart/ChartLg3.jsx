/* eslint-disable no-case-declarations */
import { useState, useEffect } from 'react';
import Chartcss from './Charts.module.scss';
import { fetchSalesData } from '../../../services/Fetching/SalesServices';  // Import fetchSalesData function
import { Line } from 'react-chartjs-2'; // Import Line from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary chart.js components

// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

    // Generate date/time labels for the x-axis based on the range
    const generateDateLabels = (range) => {
        const now = new Date();
        let labels = [];

        switch (range) {
            case 'today':
                const timeSlots = ['7AM-9AM', '9AM-11AM', '11AM-1PM', '1PM-3PM', '3PM-6PM'];
                labels = timeSlots;
                break;
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday
                for (let i = 0; i < 7; i++) {
                    const day = new Date(startOfWeek);
                    day.setDate(startOfWeek.getDate() + i);
                    labels.push(day.toLocaleString('default', { weekday: 'long' }));  // Full day name
                }
                break;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                let weekStartDate = new Date(startOfMonth);
                let weekEndDate = new Date(startOfMonth);

                for (let i = 0; i < daysInMonth; i++) {
                    const day = new Date(startOfMonth);
                    day.setDate(startOfMonth.getDate() + i);

                    // Move to the next week when it's Sunday (Day 6) or the last day of the month
                    if (day.getDay() === 0 || i === daysInMonth - 1) {
                        weekEndDate.setDate(weekEndDate.getDate() + 6);
                        labels.push(`${Math.floor(i / 7) + 1}: ${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`);
                        weekStartDate = new Date(day);
                        weekEndDate = new Date(day);
                    } else {
                        weekEndDate.setDate(weekEndDate.getDate() + 1);
                    }
                }
                break;
            case 'year':
                for (let i = 0; i < 12; i++) {
                    const month = new Date(now.getFullYear(), i, 1);
                    labels.push(month.toLocaleString('default', { month: 'short' }));
                }
                break;
            default:
                break;
        }

        return labels;
    };





    // Chart data setup
    const chartData = {
        labels: generateDateLabels(selectedRange), // Use generated date labels
        datasets: [
            {
                label: 'Total Sales (₱)',
                data: salesData.totalSales, // Sales data
                borderColor: 'rgba(170, 201, 255, 1)',
                backgroundColor: 'rgba(170, 201, 255,0.2)',
                fill: true,
                tension: 0.4, // Smooth lines
            }
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    autoSkip: true, // Skip some labels if needed
                    maxRotation: 0, // Keep labels horizontal
                    minRotation: 0, // No rotation
                    padding: 10, // Add space between labels
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (₱)', // Change Y-axis label to reflect only sales
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
