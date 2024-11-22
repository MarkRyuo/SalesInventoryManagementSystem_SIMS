import { useEffect, useState } from "react";
import Chartcss from './Charts.module.scss';
import { getAllProducts } from '../../../services/ProductService'; // Replace with actual service function
import { LiaProductHunt } from 'react-icons/lia';

function ChartLg1() {
    const [productsToday, setProductsToday] = useState([]);

    useEffect(() => {
        fetchProductsAddedOrUpdatedToday();
    }, []);

    const fetchProductsAddedOrUpdatedToday = async () => {
        try {
            const products = await getAllProducts(); // Fetch all products
            const today = new Date();
            const philippineOffset = 8 * 60; // Philippine Time Zone Offset (UTC +8)
            const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);
            const formattedToday = localTime.toISOString().split('T')[0];

            // Filter products based on `dateAdded` or `quantityHistory`
            const productsToday = products.filter(product => {
                const dateAdded = product.dateAdded && String(product.dateAdded).split('T')[0];
                const isAddedToday = dateAdded === formattedToday;

                const isUpdatedToday = product.quantityHistory?.some(entry => {
                    const entryDate = String(entry.date).split('T')[0];
                    return entryDate === formattedToday;
                });

                return isAddedToday || isUpdatedToday;
            });

            const mappedProductsToday = productsToday.map(product => {
                let quantity = product.quantity;

                // Locate today's quantity entry in quantity history
                const todayEntry = product.quantityHistory?.find(entry => {
                    const entryDate = String(entry.date).split('T')[0];
                    return entryDate === formattedToday;
                });
                if (todayEntry) {
                    quantity = todayEntry.quantity;
                }

                return {
                    ...product,
                    quantity,
                };
            });

            setProductsToday(mappedProductsToday);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <div className={Chartcss.containerChartLg1}>
            <p className="fs-6 m-0 ps-4">Products Added or Updated Today</p>
            {productsToday.length > 0 ? (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                    {productsToday.map(product => (
                        <div
                            key={product.barcode}
                            style={{
                                width: 'auto',
                                padding: 20,
                                boxShadow: '1px 1px 5px #e2dfdf',
                                borderRadius: 15,
                                flexShrink: 0,
                                borderLeft: '2px solid #92E3B8',
                                boxSizing: "border-box",
                            }}
                        >
                            <span><LiaProductHunt size={25} /></span>
                            <p className="fs-5 m-0">{product.productName}</p>
                            <p className="fs-6 m-0">SKU: {product.sku}</p>
                            <p className="fs-6 m-0">Price: {product.price}</p>
                            <p className="fs-6 m-0">Quantity: {product.quantity}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products added or updated today.</p>
            )}
        </div>
    );
}

export default ChartLg1;
