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
export const updateProductQuantity = async (barcode, additionalQuantity = 1) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
            const productData = snapshot.val();
            // Increment quantity
            const updatedQuantity = (productData.quantity || 0) + additionalQuantity;
            await set(productRef, {
                ...productData, // Spread existing product data
                quantity: updatedQuantity, // Update quantity
            });
            return updatedQuantity;
        } else {
            throw new Error("Product does not exist.");
        }
    } catch (error) {
        throw new Error("Error updating product quantity: " + error.message);
    }
};

// Add a new product in Firebase
export const addNewProduct = async ({ barcode, productName, size, color, wattage, voltage, quantity = 1, sku, price, category, dateAdded }) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        await set(productRef, {
            barcode: barcode,
            productName: productName,
            size: size, // Added size
            color: color, // Added color
            wattage: wattage, // Added wattage
            voltage: voltage, // Include voltage here
            quantity: quantity,
            sku: sku,
            price: price,
            category: category,
            dateAdded: dateAdded // Added dateAdded
        });
    } catch (error) {
        throw new Error("Error adding product: " + error.message);
    }
};
