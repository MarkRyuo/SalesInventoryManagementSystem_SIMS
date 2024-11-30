import { getDatabase, ref, get } from 'firebase/database';

// Function to fetch all product added quantity histories from Firebase
export const getProductQuantityHistory = async () => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');  // Referring to the 'products' node

    try {
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
            const productsData = snapshot.val();
            const addedQuantityHistories = [];

            // Loop through each product and get its added quantity history
            for (let productId in productsData) {
                const productData = productsData[productId];
                const addedQuantityHistory = productData.addedQuantityHistory || [];
                addedQuantityHistories.push({ productId, addedQuantityHistory });
            }

            return addedQuantityHistories;
        } else {
            console.error("No product data found.");
            return [];
        }
    } catch (error) {
        console.error('Error fetching product added quantity histories:', error);
        throw new Error('Failed to fetch product added quantity histories');
    }
};

// Utility function to filter quantities by selected time range
export const filterQuantityByRange = (addedQuantityHistories, range) => {
    const philippineOffset = 8 * 60; // Philippine Time Zone Offset (UTC +8)
    const today = new Date();
    const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);

    let startDate;

    switch (range) {
        case 'Today':
            startDate = new Date(localTime.setHours(0, 0, 0, 0)); // Start of today in Philippine Time
            break;
        case 'Week':
            startDate = new Date(localTime.setDate(localTime.getDate() - 7)); // 7 days ago from today in Philippine Time
            break;
        case 'Month':
            startDate = new Date(localTime.setDate(1)); // Start of this month in Philippine Time
            break;
        case 'Year':
            startDate = new Date(localTime.setMonth(0, 1)); // Start of this year in Philippine Time
            break;
        default:
            console.error("Invalid time range");
            return 0;
    }

    let totalQuantity = 0;

    addedQuantityHistories.forEach(product => {
        product.addedQuantityHistory.forEach(entry => {
            const entryDate = new Date(entry.date);
            const entryDateInPhilippineTime = new Date(entryDate.getTime() + (philippineOffset - entryDate.getTimezoneOffset()) * 60000);

            if (entryDateInPhilippineTime >= startDate) {
                totalQuantity += entry.quantity; // Add quantity if within the range
            }
        });
    });

    return totalQuantity;
};
