import { getDatabase, ref, set, get, update, remove } from 'firebase/database';

// Function to add a new product
export const addNewProduct = async ({ barcode, productName, size, color, wattage, voltage, quantity = 1, sku, price, category, dateAdded }) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        await set(productRef, {
            barcode: barcode,
            productName: productName,
            size: size,
            color: color,
            wattage: wattage,
            voltage: voltage,
            quantity: quantity, // Store current quantity
            quantityHistory: [{ date: dateAdded.split('T')[0], quantity }], // Store date and quantity (only date)
            sku: sku,
            price: price,
            category: category,
            dateAdded: dateAdded.split('T')[0], // Set date added (only date)
            lastUpdated: new Date().toISOString().split('T')[0], // Set last updated date (only date)
        });
    } catch (error) {
        throw new Error(`Error adding product: ${error.message}`);
    }
};

// Function to update the product quantity
export const updateProductQuantity = async (barcode, additionalQuantity) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        const productSnapshot = await get(productRef);
        if (!productSnapshot.exists()) {
            throw new Error('Product not found');
        }

        const productData = productSnapshot.val();
        const currentQuantity = productData.quantity || 0;
        const updatedQuantity = currentQuantity + additionalQuantity;

        // Update quantity history
        const newQuantityHistory = [
            ...(productData.quantityHistory || []),
            { date: new Date().toISOString().split('T')[0], quantity: updatedQuantity } // Store the updated quantity on this date
        ];

        await update(productRef, {
            quantity: updatedQuantity, // Update quantity
            quantityHistory: newQuantityHistory, // Update quantity history
            lastUpdated: new Date().toISOString().split('T')[0], // Update last updated date (only date)
        });

        return updatedQuantity; // Return the updated quantity
    } catch (error) {
        throw new Error(`Error updating quantity: ${error.message}`);
    }
};

// Function to fetch a product by barcode
export const fetchProductByBarcode = async (barcode) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);
    const snapshot = await get(productRef);
    return snapshot.exists() ? snapshot.val() : null;
};

// Function to delete a product by barcode
export const deleteProduct = async (barcode) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        await remove(productRef);
    } catch (error) {
        throw new Error(`Error deleting product: ${error.message}`);
    }
};

// Function to retrieve all products
export const getAllProducts = async () => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');

    try {
        const snapshot = await get(productsRef);
        if (!snapshot.exists()) {
            return [];
        }
        return snapshot.val();
    } catch (error) {
        throw new Error(`Error retrieving products: ${error.message}`);
    }
};
