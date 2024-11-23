import { getDatabase, ref, get } from 'firebase/database';

// Function to fetch product quantity history from Firebase
export const getProductQuantityHistory = async (productId) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + productId);

    try {
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
            const productData = snapshot.val();
            const quantityHistory = productData.quantityHistory || [];
            return quantityHistory;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching product quantity history:', error);
        throw new Error('Failed to fetch product quantity history');
    }
};

// Utility function to filter quantities by selected time range
export const filterQuantityByRange = (quantityHistory, range) => {
    const now = new Date();
    let startDate;

    switch (range) {
        case 'Today':
            startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
            break;
        case 'Week':
            startDate = new Date(now.setDate(now.getDate() - 7)); // 7 days ago
            break;
        case 'Month':
            startDate = new Date(now.setDate(1)); // Start of this month
            break;
        case 'Year':
            startDate = new Date(now.setMonth(0, 1)); // Start of this year
            break;
        default:
            return 0;
    }

    return quantityHistory.reduce((total, entry) => {
        const entryDate = new Date(entry.date);
        if (entryDate >= startDate) {
            total += entry.quantity; // Add up the quantity if within the range
        }
        return total;
    }, 0);
};
