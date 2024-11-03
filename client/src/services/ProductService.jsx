import { getDatabase, ref, set, get, update, remove } from 'firebase/database';

// Function to add a new product
export const addNewProduct = async ({ barcode, productName, size, color, wattage, voltage, quantity = 1, sku, price, category, dateAdded }) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        const today = dateAdded.split('T')[0];
        await set(productRef, {
            barcode: barcode,
            productName: productName,
            size: size,
            color: color,
            wattage: wattage,
            voltage: voltage,
            quantity: quantity, // Store current quantity
            quantityHistory: [{ date: today, quantity: quantity }], // Store initial quantity with date in array
            addedQuantityHistory: [{ date: today, quantity: quantity }], // Track quantities added over time
            deductedQuantityHistory: [], // Initialize deducted quantity history as an empty array
            preserveQuantityHistory: true, // Track preservation setting
            sku: sku,
            price: price, // Keep price as is for storage
            category: category,
            dateAdded: today, // Set date added (only date)
            lastUpdated: today, // Set last updated date (only date)
        });
    } catch (error) {
        throw new Error(`Error adding product: ${error.message}`);
    }
};

// Function to update the product quantity with separate tracking for additions and deductions
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

        // Get today's date
        const today = new Date().toISOString().split('T')[0];

        // Check if preserveQuantityHistory is enabled
        const preserveQuantityHistory = productData.preserveQuantityHistory || false;

        // Update quantity history: Keep the history unchanged
        const newQuantityHistory = preserveQuantityHistory
            ? [...(productData.quantityHistory || [])]
            : [];

        // Update today's quantity in the history
        const quantityEntry = newQuantityHistory.find(entry => entry.date === today);
        if (quantityEntry) {
            // Update the existing entry with the new total quantity
            quantityEntry.quantity = updatedQuantity; // This keeps the quantity for today updated
        } else {
            // If no entry exists, add a new entry for today's quantity
            newQuantityHistory.push({ date: today, quantity: updatedQuantity });
        }

        // Update added quantity history
        const newAddedQuantityHistory = [...(productData.addedQuantityHistory || [])];
        if (additionalQuantity > 0) {
            const addedEntry = newAddedQuantityHistory.find(entry => entry.date === today);
            if (addedEntry) {
                // If an entry for today exists, increment the added quantity
                addedEntry.quantity += additionalQuantity; // Add to the total added quantity
            } else {
                // If no entry exists, add a new entry
                newAddedQuantityHistory.push({
                    date: today,
                    quantity: additionalQuantity,
                });
            }
        }

        // Update deducted quantity history
        const newDeductedQuantityHistory = [...(productData.deductedQuantityHistory || [])];
        if (additionalQuantity < 0) {
            const deductedEntry = newDeductedQuantityHistory.find(entry => entry.date === today);
            if (deductedEntry) {
                // If an entry for today exists, increment the deducted quantity
                deductedEntry.quantity -= additionalQuantity; // Since additionalQuantity is negative, this effectively adds to the deducted quantity
            } else {
                // If no entry exists, add a new entry
                newDeductedQuantityHistory.push({
                    date: today,
                    quantity: -additionalQuantity,
                });
            }
        }

        await update(productRef, {
            quantity: updatedQuantity, // Update total quantity
            quantityHistory: newQuantityHistory, // Update quantity history
            addedQuantityHistory: newAddedQuantityHistory, // Update added quantity history
            deductedQuantityHistory: newDeductedQuantityHistory, // Update deducted quantity history as an array
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
        // Format prices with peso sign (₱) before returning
        const products = snapshot.val();
        for (const key in products) {
            products[key].price = `₱${products[key].price.toFixed(2)}`;
        }
        return products;
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

// Function to update existing products to include preserveQuantityHistory
export const updatePreserveQuantityHistoryForExistingProducts = async () => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');

    try {
        const snapshot = await get(productsRef);
        if (!snapshot.exists()) {
            console.log('No products found.');
            return;
        }

        const products = snapshot.val();
        const updates = {};

        for (const barcode in products) {
            updates[`${barcode}/preserveQuantityHistory`] = true; // Set preserveQuantityHistory to true
        }

        await update(productsRef, updates);
        console.log('Successfully updated preserveQuantityHistory for all products.');
    } catch (error) {
        throw new Error(`Error updating preserveQuantityHistory: ${error.message}`);
    }
};
