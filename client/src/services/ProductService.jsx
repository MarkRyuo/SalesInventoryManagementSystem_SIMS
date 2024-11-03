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
            quantityHistory: [{ date: dateAdded.split('T')[0], quantity: quantity }], // Store initial quantity with date
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

// Function to update the product quantity with history tracking
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
        const newQuantityHistory = [...(productData.quantityHistory || [])];
        const today = new Date().toISOString().split('T')[0];

        // Add a new entry for today's quantity change
        newQuantityHistory.push({ date: today, quantity: additionalQuantity });

        await update(productRef, {
            quantity: updatedQuantity, // Update total quantity
            quantityHistory: newQuantityHistory, // Update quantity history with separate date and quantity
            lastUpdated: today, // Update last updated date (only date)
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

// Function to add a new category
export const addCategory = async (category) => {
    const db = getDatabase();
    const categoryRef = ref(db, 'categories/' + category); // Save category by name

    try {
        await set(categoryRef, { name: category }); // Store category
    } catch (error) {
        throw new Error(`Error adding category: ${error.message}`);
    }
};

// Function to retrieve all categories
export const getCategories = async () => {
    const db = getDatabase();
    const categoriesRef = ref(db, 'categories');

    try {
        const snapshot = await get(categoriesRef);
        return snapshot.exists() ? Object.keys(snapshot.val()) : []; // Return an array of category names
    } catch (error) {
        throw new Error(`Error retrieving categories: ${error.message}`);
    }
};
