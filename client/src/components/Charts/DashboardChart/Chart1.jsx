import { useState, useEffect } from 'react';
import Chartcss from './Charts.module.scss';
import { filterQuantityByRange } from '../../../services/Fetching/StockInServices';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner from React-Bootstrap
import { getDatabase, ref, onValue } from 'firebase/database'; // Firebase Realtime Database imports

function Chart1() {
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const db = getDatabase(); // Initialize Firebase Realtime Database

        // Firebase reference to the products node
        const productsRef = ref(db, 'products');

        // Real-time listener to fetch and update quantity when the data changes
        const quantityListener = onValue(productsRef, (snapshot) => {
            setLoading(true); // Show loading indicator
            try {
                if (snapshot.exists()) {
                    const productsData = snapshot.val();
                    console.log("All products data found:", productsData); // Log products data for debugging
                    const quantityHistories = [];

                    // Loop through each product and get its quantity history
                    for (let productId in productsData) {
                        const productData = productsData[productId];
                        const quantityHistory = productData.quantityHistory || [];
                        quantityHistories.push({ productId, quantityHistory });
                    }

                    // Filter the quantity based on 'Today'
                    const totalQuantity = filterQuantityByRange(quantityHistories, 'Today');
                    setQuantity(totalQuantity); // Update the state with filtered quantity
                } else {
                    console.error("No product data found.");
                    setQuantity(0);
                }
            } catch (error) {
                console.error('Error fetching quantity:', error);
            } finally {
                setLoading(false); // Hide loading indicator
            }
        });

        // Cleanup the listener on component unmount
        return () => {
            // Remove the real-time listener when the component unmounts
            quantityListener();
        };
    }, []);

    return (
        <div className={Chartcss.containerChart1}>
            <h5>Stock Movement</h5>
            <div className={Chartcss.contentChart1}>
                {loading ? (
                    <Spinner animation="grow" variant="success" /> // Show spinner while loading
                ) : (
                    <p>{quantity}</p> // Display total quantity after loading
                )}
            </div>
        </div>
    );
}

export default Chart1;
