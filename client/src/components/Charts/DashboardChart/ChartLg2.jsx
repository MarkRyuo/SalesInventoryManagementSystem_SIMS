import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { fetchInventoryTurnover } from "../../../services/Fetching/InventoryTurnOverService";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import Chartcss from "./Charts.module.scss"; // Import your design styles

// Register necessary plugins, including the Filler plugin
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ChartLg2() {
    const [turnoverData, setTurnoverData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedRange, setSelectedRange] = useState("month");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const turnover = await fetchInventoryTurnover(selectedRange);
                const now = new Date();

                setTurnoverData((prev) => [...prev, turnover]);
                setLabels((prev) => [...prev, now.toLocaleDateString()]);
            } catch (error) {
                console.error("Error fetching turnover data:", error);
            }
        };

        fetchData();
    }, [selectedRange]);

    const handleRangeChange = (range) => setSelectedRange(range);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Inventory Turnover",
                data: turnoverData,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true, // Fill under the line
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Turnover Rate",
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    return (
        <div className={Chartcss.containerChartLg2}>
            <div className={Chartcss.rangeButtons}>
                <select onChange={(e) => handleRangeChange(e.target.value)} className="form-select">
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

export default ChartLg2;
