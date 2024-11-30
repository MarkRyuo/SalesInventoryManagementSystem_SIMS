import { getDatabase, ref, get } from 'firebase/database';

// Function to fetch all product quantity histories from Firebase
export const getProductQuantityHistory = async () => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');  // Referring to the 'products' node

    try {
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
            const productsData = snapshot.val();
            const quantityHistories = [];

            // Loop through each product and get its quantity history
            for (let productId in productsData) {
                const productData = productsData[productId];
                const quantityHistory = productData.quantityHistory || [];
                quantityHistories.push({ productId, quantityHistory });
            }

            return quantityHistories;
        } else {
            console.error("No product data found.");
            return [];
        }
    } catch (error) {
        console.error('Error fetching product quantity histories:', error);
        throw new Error('Failed to fetch product quantity histories');
    }
};

// Utility function to filter quantities by selected time range
export const filterQuantityByRange = (quantityHistories, range) => {
    // Get the current date and adjust it to Philippine Time (UTC +8)
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

    // Initialize total quantity
    let totalQuantity = 0;

    // Loop through quantityHistories to filter by time range
    quantityHistories.forEach(product => {
        product.quantityHistory.forEach(entry => {
            const entryDate = new Date(entry.date);
            // Adjust entry date to Philippine Time
            const entryDateInPhilippineTime = new Date(entryDate.getTime() + (philippineOffset - entryDate.getTimezoneOffset()) * 60000);

            // Check if the entry's date is within the selected range
            if (entryDateInPhilippineTime >= startDate) {
                totalQuantity += entry.quantity; // Add quantity if within the range
            }
        });
    });

    return totalQuantity;
};
