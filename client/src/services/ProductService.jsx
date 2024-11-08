import { getDatabase, ref, set, get, update, remove } from 'firebase/database';

// Function to add a new product
export const addNewProduct = async ({ barcode, productName, size, color, wattage, voltage, quantity = 1, sku, price, tax, category}) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        // Adjust for Philippine Time (UTC +8)
        const today = new Date();
        const philippineOffset = 8 * 60; // Philippine Time Zone Offset (UTC +8)
        const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);
        const formattedToday = localTime.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        await set(productRef, {
            barcode: barcode,
            productName: productName,
            size: size,
            color: color,
            wattage: wattage,
            voltage: voltage,
            quantity: quantity,
            quantityHistory: [{ date: formattedToday, quantity: quantity }],
            addedQuantityHistory: [{ date: formattedToday, quantity: quantity }],
            deductedQuantityHistory: [],
            preserveQuantityHistory: true,
            sku: sku,
            price: price,
            tax: tax, // Store tax as percentage
            category: category,
            dateAdded: formattedToday,
            lastUpdated: formattedToday,
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

        // Check if the updated quantity would be zero or negative
        if (updatedQuantity < 0) {
            throw new Error(`Insufficient quantity. Current quantity is ${currentQuantity}. Cannot reduce by ${Math.abs(additionalQuantity)}.`);
        }

        // Adjust for Philippine Time (UTC +8)
        const today = new Date();
        const philippineOffset = 8 * 60; // Philippine Time Zone Offset (UTC +8)
        const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);
        const formattedToday = localTime.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // Check if preserveQuantityHistory is enabled
        const preserveQuantityHistory = productData.preserveQuantityHistory || false;

        // Update quantity history: Keep the history unchanged
        const newQuantityHistory = preserveQuantityHistory
            ? [...(productData.quantityHistory || [])]
            : [];

        // Update today's quantity in the history
        const quantityEntry = newQuantityHistory.find(entry => entry.date === formattedToday);
        if (quantityEntry) {
            // Update the existing entry with the new total quantity
            quantityEntry.quantity = updatedQuantity; // This keeps the quantity for today updated
        } else {
            // If no entry exists, add a new entry for today's quantity
            newQuantityHistory.push({ date: formattedToday, quantity: updatedQuantity });
        }

        // Update added quantity history
        const newAddedQuantityHistory = [...(productData.addedQuantityHistory || [])];
        if (additionalQuantity > 0) {
            const addedEntry = newAddedQuantityHistory.find(entry => entry.date === formattedToday);
            if (addedEntry) {
                // If an entry for today exists, increment the added quantity
                addedEntry.quantity += additionalQuantity; // Add to the total added quantity
            } else {
                // If no entry exists, add a new entry
                newAddedQuantityHistory.push({
                    date: formattedToday,
                    quantity: additionalQuantity,
                });
            }
        }

        // Update deducted quantity history
        const newDeductedQuantityHistory = [...(productData.deductedQuantityHistory || [])];
        if (additionalQuantity < 0) {
            const deductedEntry = newDeductedQuantityHistory.find(entry => entry.date === formattedToday);
            if (deductedEntry) {
                // If an entry for today exists, increment the deducted quantity
                deductedEntry.quantity -= additionalQuantity; // Since additionalQuantity is negative, this effectively adds to the deducted quantity
            } else {
                // If no entry exists, add a new entry
                newDeductedQuantityHistory.push({
                    date: formattedToday,
                    quantity: -additionalQuantity,
                });
            }
        }

        await update(productRef, {
            quantity: updatedQuantity, // Update total quantity
            quantityHistory: newQuantityHistory, // Update quantity history
            addedQuantityHistory: newAddedQuantityHistory, // Update added quantity history
            deductedQuantityHistory: newDeductedQuantityHistory, // Update deducted quantity history as an array
            lastUpdated: formattedToday, // Update last updated date (only date)
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
            console.log("No products found.");
            return []; // Return an empty array if no products are found
        }

        const products = snapshot.val();

        // Ensure price and tax remain numeric and convert product data into an array
        const formattedProducts = Object.keys(products).map(key => {
            const product = products[key];
            product.price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
            product.tax = typeof product.tax === 'number' ? product.tax : parseFloat(product.tax) || 0; // Ensure tax is treated as percentage
            return product;
        });


        console.log("Retrieved products:", formattedProducts);
        return formattedProducts;
    } catch (error) {
        console.error("Error retrieving products:", error);
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

// Function to save an order to Firebase
export const saveOrderToFirebase = async (orderDetails) => {
    const db = getDatabase();
    const newOrderRef = ref(db, 'orders/' + Date.now()); // Using timestamp as a unique ID
    try {
        await set(newOrderRef, orderDetails);
    } catch (error) {
        throw new Error(`Error saving order: ${error.message}`);
    }
};

// Function to fetch order history from Firebase
export const fetchOrderHistoryFromFirebase = async () => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    try {
        const snapshot = await get(ordersRef);
        if (snapshot.exists()) {
            return Object.values(snapshot.val()); // Assuming orders are stored as objects
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(`Error fetching order history: ${error.message}`);
    }
};


// Function to update the product in Firebase
export const updateProductInDatabase = async (updatedProduct) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + updatedProduct.barcode);

    try {
        await update(productRef, updatedProduct);
        console.log('Product updated successfully');
    } catch (error) {
        console.error('Error updating product in database:', error.message);
    }
};
