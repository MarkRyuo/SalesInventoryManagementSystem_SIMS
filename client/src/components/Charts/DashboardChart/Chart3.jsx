import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { fetchQuantitySoldByRange } from '../../../services/ProductService'; // Import the new service

function Chart3() {
    const [quantitySold, setQuantitySold] = useState(0);
    const [timeRange, setTimeRange] = useState("Today");

    useEffect(() => {
        const fetchQuantitySold = async () => {
            try {
                const totalQuantity = await fetchQuantitySoldByRange(timeRange);
                setQuantitySold(totalQuantity);
            } catch (error) {
                console.error('Error fetching quantity sold:', error);
                setQuantitySold(0); // Fallback to 0 in case of error
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
