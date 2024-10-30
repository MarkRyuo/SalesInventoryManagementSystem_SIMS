import { getDatabase, ref, set, get, update, remove } from 'firebase/database';

// Comment Only (This code is a module for managing products and categories in a Sales Inventory Management System using Firebase Realtime Database. It provides various functions to handle product data, including adding, updating, fetching, and deleting products, as well as managing categories. )

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
            quantityHistory: [`${dateAdded.split('T')[0]}: ${quantity}`], // Store date and initial quantity as a single string
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

// Function to update the product quantity (with fix applied)
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

        // Check if today's entry exists in the history
        const existingEntryIndex = newQuantityHistory.findIndex(entry => entry.startsWith(today));

        if (existingEntryIndex > -1) {
            // If today's entry exists, only update it with today's added quantity
            const [, previousQuantity] = newQuantityHistory[existingEntryIndex].split(': '); // Destructuring only previousQuantity
            const updatedHistoryQuantity = parseInt(previousQuantity) + additionalQuantity;
            newQuantityHistory[existingEntryIndex] = `${today}: ${updatedHistoryQuantity}`;
        } else {
            // Otherwise, add a new entry with today's added quantity
            newQuantityHistory.push(`${today}: ${additionalQuantity}`);
        }

        await update(productRef, {
            quantity: updatedQuantity, // Update total quantity
            quantityHistory: newQuantityHistory, // Update quantity history
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
