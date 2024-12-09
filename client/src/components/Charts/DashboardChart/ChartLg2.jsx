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
    const [selectedRange, setSelectedRange] = useState("month"); // Default range set to "month"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper function to format labels based on the selected range
    const generateLabels = (range) => {
        const now = new Date();
        const labels = [];

        if (range === "month") {
            // Only show the current month
            labels.push(now.toLocaleString("default", { month: "long" }));
        } else if (range === "quarter") {
            labels.push("Q1", "Q2", "Q3", "Q4");
        } else if (range === "year") {
            for (let i = 0; i < 12; i++) {
                const month = new Date(now.getFullYear(), i, 1);
                labels.push(month.toLocaleString("default", { month: "long" }));
            }
        }
        return labels;
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const now = new Date();
                const turnover = await fetchInventoryTurnover(selectedRange, now); // Pass 'now' as a parameter
                // Set labels based on the selected range
                setLabels(generateLabels(selectedRange));

                // Set turnover data
                setTurnoverData((prev) => [...prev, turnover]);
            } catch (error) {
                setError("Failed to load inventory turnover data.");
                console.error("Error fetching turnover data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedRange]); // Effect runs again whenever the selectedRange changes

    // This function updates the selected range when the user selects a new range
    const handleRangeChange = (range) => {
        setSelectedRange(range);
    };

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
                    <option value="month">Month</option>
                    <option value="quarter">Quarter</option>
                    <option value="year">Year</option>
                </select>
            </div>

            {loading && <div>Loading...</div>} {/* Display loading state */}
            {error && <div>{error}</div>} {/* Display error message */}

            <Line data={chartData} options={chartOptions} />
        </div>
    );
}

export default ChartLg2;

