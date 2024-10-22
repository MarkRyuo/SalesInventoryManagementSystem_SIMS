import { getDatabase, ref, get, set } from 'firebase/database';

// Fetch product details from Firebase by barcode
export const fetchProductByBarcode = async (barcode) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
            return snapshot.val(); // Return product details if exists
        } else {
            return null; // Return null if product does not exist
        }
    } catch (error) {
        throw new Error("Error fetching product: " + error.message);
    }
};

// Update the quantity of a product in Firebase
export const updateProductQuantity = async (barcode, productData, additionalQuantity = 1) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        // Increment quantity and update the product data
        const updatedQuantity = (productData.quantity || 0) + additionalQuantity;
        await set(productRef, {
            ...productData,
            quantity: updatedQuantity,
        });
        return updatedQuantity;
    } catch (error) {
        throw new Error("Error updating product quantity: " + error.message);
    }
};

// Add a new product in Firebase
export const addNewProduct = async (barcode, productName, quantity = 1) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        await set(productRef, {
            barcode: barcode,
            productName: productName,
            quantity: quantity,
        });
    } catch (error) {
        throw new Error("Error adding product: " + error.message);
    }
};
