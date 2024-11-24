import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchQuantitySoldByRange } from '../../../services/ProductService'; // Import the new service

function Chart3() {
    const [quantitySold, setQuantitySold] = useState(0);
    const [timeRange, setTimeRange] = useState("Today");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQuantitySold = async () => {
            setLoading(true); // Set loading to true when fetching data
            try {
                const totalQuantity = await fetchQuantitySoldByRange(timeRange);
                setQuantitySold(totalQuantity);
            } catch (error) {
                console.error('Error fetching quantity sold:', error);
                setQuantitySold(0); // Fallback to 0 in case of error
            } finally {
                setLoading(false); // Set loading to false when data is fetched
            }
        };

        fetchQuantitySold();
    }, [timeRange]); // Re-fetch sales data whenever timeRange changes

    return (
        <div className={Chartcss.containerChart3}>
            <h5 className='m-0 p-0'>Quantity Sold</h5>

            <div className={Chartcss.contentChart3}>
                <p className='m-0'>{loading ? "Loading..." : quantitySold}</p>
                <div>
                    <select
                        className="form-select"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)} // Handle change to set the selected value
                    >
                        <option value="Today">Today</option>
                        <option value="7 Days">7 Days</option>
                        <option value="Month">Month</option>
                        <option value="Year">Year</option>
                    </select>
                </div>
            </div>

        </div>
    );
}

export default Chart3;
