import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { fetchInventoryTurnover } from "../../../services/Fetching/InventoryTurnOverService";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Chartcss from "./Charts.module.scss"; // Import your design styles

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
                fill: true,
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
        <div className={Chartcss.containerChartLg2}> {/* Use your design container */}
            <div className={Chartcss.rangeButtons}> {/* Optional style for buttons */}
                <button onClick={() => handleRangeChange("today")}>Today</button>
                <button onClick={() => handleRangeChange("week")}>Week</button>
                <button onClick={() => handleRangeChange("month")}>Month</button>
                <button onClick={() => handleRangeChange("year")}>Year</button>
            </div>
            <Line data={chartData} options={chartOptions} /> {/* Chart component */}
        </div>
    );
}

export default ChartLg2;
