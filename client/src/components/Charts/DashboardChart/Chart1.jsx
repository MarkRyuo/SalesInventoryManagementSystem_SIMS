import { useState, useEffect } from 'react';
import Chartcss from './Charts.module.scss';
import { getProductQuantityHistory, filterQuantityByRange } from '../../../services/Fetching/StockInServices';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner from React-Bootstrap

function Chart1() {
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQuantity = async () => {
            setLoading(true); // Show loading indicator
            try {
                const quantityHistories = await getProductQuantityHistory();
                const totalQuantity = filterQuantityByRange(quantityHistories, 'Today');
                setQuantity(totalQuantity);
            } catch (error) {
                console.error('Error fetching quantity:', error);
            } finally {
                setLoading(false); // Hide loading indicator
            }
        };

        // Fetch initial quantity and set up polling for live updates
        fetchQuantity();
        const interval = setInterval(fetchQuantity, 5000); // Update every 5 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <div className={Chartcss.containerChart1}>
            <h5>Total Stock (Today)</h5>
            <div className={Chartcss.contentChart1}>
                {loading ? (
                    <Spinner animation="grow" variant="success" /> // Show spinner
                ) : (
                    <p>{quantity}</p> // Show quantity when not loading
                )}
            </div>
        </div>
    );
}

export default Chart1;
