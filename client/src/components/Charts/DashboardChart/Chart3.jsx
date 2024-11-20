import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { fetchSalesData } from '../../../services/ProductService'; // Fetch sales data

function Chart3() {
    const [quantitySold, setQuantitySold] = useState(0);
    const [timeRange, setTimeRange] = useState("Today");

    useEffect(() => {
        const fetchQuantitySold = async () => {
            try {
                const salesData = await fetchSalesData(); // Fetch all sales data

                const now = new Date();
                let startDate, endDate;

                // Calculate the date range based on the selected time range
                switch (timeRange) {
                    case "Today":
                        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
                        endDate = now;
                        break;
                    case "7 Days":
                        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // 7 days ago
                        endDate = now;
                        break;
                    case "Month":
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
                        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the month
                        break;
                    case "Year":
                        startDate = new Date(now.getFullYear(), 0, 1); // Start of the year
                        endDate = new Date(now.getFullYear(), 11, 31); // End of the year
                        break;
                    default:
                        return;
                }

                // Calculate total quantity sold for the selected range
                const totalQuantity = salesData.reduce((acc, sale) => {
                    const saleDate = new Date(sale.date);
                    if (saleDate >= startDate && saleDate <= endDate) {
                        acc += sale.quantitySold || 0; // Add the sold quantity from each transaction
                    }
                    return acc;
                }, 0);

                setQuantitySold(totalQuantity);
            } catch (error) {
                console.error('Error fetching quantity sold:', error);
            }
        };

        fetchQuantitySold();
    }, [timeRange]); // Re-fetch sales data whenever timeRange changes

    return (
        <div className={Chartcss.containerChart3}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Quantity Sold</p>
            </div>

            <div className={Chartcss.contentChart}>
                <p className='m-0'>{quantitySold}</p>
                <p className='m-2'>For the selected range</p>
            </div>

            <Dropdown className={Chartcss.dropdown}>
                <Dropdown.Toggle variant="primary" id="timeRangeDropdown">
                    {timeRange}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTimeRange("Today")}>Today</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange("7 Days")}>7 Days</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange("Month")}>Month</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange("Year")}>Year</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default Chart3;
