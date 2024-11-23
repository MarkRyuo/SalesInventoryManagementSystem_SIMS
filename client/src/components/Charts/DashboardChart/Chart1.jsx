import { useState, useEffect } from 'react';
import { FaReact } from 'react-icons/fa';
import Chartcss from './Charts.module.scss';
import { getProductQuantityHistory, filterQuantityByRange } from '../../../services/Fetching/StockInServices'; // Import the functions

// Chart1 Small component to display quantity data for the selected time range
// eslint-disable-next-line react/prop-types
function Chart1({ productId }) {
    const [quantity, setQuantity] = useState(0);
    const [timeRange, setTimeRange] = useState('Today'); // Default to 'Today'

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    useEffect(() => {
        const fetchQuantity = async () => {
            try {
                const quantityHistory = await getProductQuantityHistory(productId);
                const totalQuantity = filterQuantityByRange(quantityHistory, timeRange);
                setQuantity(totalQuantity);
            } catch (error) {
                console.error('Error fetching quantity:', error);
            }
        };

        fetchQuantity();
    }, [productId, timeRange]); // Re-fetch data if productId or timeRange changes

    return (
        <div className={Chartcss.containerChart1}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p>{productId}</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p>{quantity}</p>
                <p>From the running {timeRange.toLowerCase()}</p>
                <div>
                    <button onClick={() => handleTimeRangeChange('Today')}>Today</button>
                    <button onClick={() => handleTimeRangeChange('Week')}>Week</button>
                    <button onClick={() => handleTimeRangeChange('Month')}>Month</button>
                    <button onClick={() => handleTimeRangeChange('Year')}>Year</button>
                </div>
            </div>
        </div>
    );
}

export default Chart1;
