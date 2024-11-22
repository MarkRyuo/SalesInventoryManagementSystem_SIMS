import { useEffect, useState } from 'react';
import { getTodaysProductActivity } from '../../../services/ProductService'; // Import the function
import Chartcss from './Charts.module.scss';

function ChartLg1() {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            const products = await getTodaysProductActivity();
            setProductData(products);
        };

        fetchProductData();
    }, []);

    return (
        <div className={Chartcss.containerChartLg1}>
            {/* Display the Product Activity here */}
            <h3>Todays Product Activity</h3>
            <ul>
                {productData.length > 0 ? (
                    productData.map((product, index) => (
                        <li key={index}>
                            <strong>{product.name}</strong> - Price: {product.price} - Quantity: {product.quantity}
                        </li>
                    ))
                ) : (
                    <p>No products added or updated today.</p>
                )}
            </ul>
        </div>
    );
}

export default ChartLg1;
