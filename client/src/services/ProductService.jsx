import { getDatabase, ref, set, get, update, remove, onValue, push, runTransaction} from 'firebase/database';

//? Product Management, Category Management, Order Management, Discount Management, Tax Management, Preserve Quantity History, Re Ordering

//* Start of Product
// Function to add a new product
export const addNewProduct = async ({ barcode, productName, size, color, wattage, voltage, quantity = 1, sku, price, category}) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + barcode);

    try {
        //! Adjust for Philippine Time (UTC +8)
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
            // tax: tax, // Store tax as percentage
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
    if (snapshot.exists()) {
        const productData = snapshot.val();
        // Include the barcode as the productId, or map it if you store the productId elsewhere
        return { ...productData, productId: barcode }; // Assuming the barcode is the productId
    }
    return null;
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

            // Ensure product is an object before proceeding
            if (typeof product !== 'object' || Array.isArray(product) || !product) {
                console.warn(`Skipping invalid product data at key: ${key}`);
                return null; // Skip invalid entries
            }

            // Ensure price and tax are numeric
            product.price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
            product.tax = typeof product.tax === 'number' ? product.tax : parseFloat(product.tax) || 0;

            return product;
        }).filter(product => product !== null); // Filter out any null values

        console.log("Retrieved products:", formattedProducts);
        return formattedProducts;
    } catch (error) {
        console.error("Error retrieving products:", error);
        throw new Error(`Error retrieving products: ${error.message}`);
    }
};
//! End of Product

//* Start Category  
//? Function to add a new category
export const addCategory = async (categoryName) => {
    const db = getDatabase();
    const categoryRef = ref(db, 'categories/' + categoryName); // Save category by name

    try {
        await set(categoryRef, { name: categoryName }); // Store category
    } catch (error) {
        throw new Error(`Error adding category: ${error.message}`);
    }
};

//? Function to retrieve all categories
export const getCategories = async () => {
    const db = getDatabase();
    const categoriesRef = ref(db, 'categories');

    try {
        const snapshot = await get(categoriesRef);
        const categoriesData = snapshot.exists() ? snapshot.val() : {};

        return Object.keys(categoriesData).map(key => ({
            id: key,
            name: categoriesData[key].name
        }));
    } catch (error) {
        throw new Error(`Error retrieving categories: ${error.message}`);
    }
};

export const getCategoriesNewAssets = async () => {
    const db = getDatabase();
    const categoriesRef = ref(db, 'categories');

    try {
        const snapshot = await get(categoriesRef);
        const categoriesData = snapshot.exists() ? snapshot.val() : {};

        // Return only the category names
        return Object.keys(categoriesData).map(key => categoriesData[key].name);
    } catch (error) {
        throw new Error(`Error retrieving categories: ${error.message}`);
    }
};

//? Function to delete a category
export const deleteCategory = async (categoryName) => {
        const db = getDatabase();
        const categoryRef = ref(db, 'categories/' + categoryName);

        try {
            await remove(categoryRef);
            console.log(`Category ${categoryName} deleted successfully`);
        } catch (error) {
            throw new Error(`Error deleting category: ${error.message}`);
        }
};

export const updateCategory = async (categoryName, newCategoryData) => {
        const db = getDatabase();
        const categoryRef = ref(db, 'categories/' + categoryName);

        try {
            await update(categoryRef, newCategoryData);
            console.log(`Category ${categoryName} updated successfully`);
        } catch (error) {
            throw new Error(`Error updating category: ${error.message}`);
        }
};
//! End of Category

//* Start of PreserveQuantityHistoryForExistingProducts
//? Function to update existing products to include preserveQuantityHistory
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

//! End of PreserveQuantityHistoryForExistingProducts

//* Start of Order
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

export const editProductInDatabase = async (updatedProduct) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + updatedProduct.barcode); // Assuming barcode is the unique key
    try {
        await update(productRef, updatedProduct); // Update the product with new data
        console.log('Product updated successfully');
    } catch (error) {
        console.error('Error updating product:', error.message);
    }
};

//! End of Order

//* Start AddNewDiscount
export const addNewDiscount = async ({ discountName, discountValue }) => {
    const db = getDatabase();
    const discountId = Date.now();
    const discountRef = ref(db, `discounts/${discountId}`);

    try {
        await set(discountRef, {
            id: discountId,
            name: discountName,
            value: discountValue,
            createdAt: new Date().toISOString(),
        });
        console.log("Discount added successfully");
    } catch (error) {
        throw new Error(`Error adding discount: ${error.message}`);
    }
};

// Function to fetch all discounts
export const fetchAllDiscounts = async () => {
    const db = getDatabase();
    const discountsRef = ref(db, "discounts");

    try {
        const snapshot = await get(discountsRef);
        return snapshot.exists() ? Object.values(snapshot.val()) : [];
    } catch (error) {
        throw new Error(`Error fetching discounts: ${error.message}`);
    }
};

//! End of AddNewDiscount

//* Start ReOrdering
// Function to fetch low stock or out of stock products for reordering
export const fetchReorderingProducts = async () => {
    const products = await getAllProducts();

    // Filter products that are either Low Stock or Out of Stock
    const reorderingProducts = products.filter((product) => {
        const instockThreshold = product.instockthreshold ?? 0;
        const lowStockThreshold = instockThreshold / 4;
        const quantity = product.quantity ?? 0;

        // Only consider products with valid thresholds and quantities
        return quantity === 0 || (quantity > 0 && quantity <= lowStockThreshold);
    });

    return reorderingProducts;
};

// Function to fetch saved orders from Firebase
export const fetchSavedOrders = async () => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders'); // Reference to the orders node in Firebase

    try {
        const snapshot = await get(ordersRef);
        if (snapshot.exists()) {
            const ordersData = snapshot.val();
            console.log('Fetched orders:', ordersData);

            // Convert orders from object to array with order ID included
            return Object.entries(ordersData).map(([key, order]) => ({
                ...order,
                id: key, // Include the Firebase key as the order ID
            }));
        } else {
            console.log('No saved orders found.');
            return []; // Return an empty array if no orders exist
        }
    } catch (error) {
        console.error('Error fetching saved orders:', error);
        throw new Error(`Error fetching saved orders: ${error.message}`);
    }
};

// Function to delete a saved order by order ID
export const deleteSavedOrder = async (orderId) => {
    const db = getDatabase();
    const orderRef = ref(db, 'orders/' + orderId); // Reference to the specific order by ID

    try {
        // Remove the order from Firebase
        await remove(orderRef);
        console.log(`Order with ID ${orderId} deleted successfully`);
    } catch (error) {
        console.error('Error deleting order:', error);
        throw new Error(`Error deleting order: ${error.message}`);
    }
};
//! End of Reordering

//* Start AddNewTax 
export const addNewTax = async ({ taxName, taxValue }) => {
    const db = getDatabase();
    const taxId = Date.now(); // Use timestamp as unique ID
    const taxRef = ref(db, `taxes/${taxId}`);

    try {
        await set(taxRef, {
            id: taxId,
            name: taxName,
            value: taxValue,
            createdAt: new Date().toISOString(),
        });
        console.log("Tax added successfully");
    } catch (error) {
        throw new Error(`Error adding tax: ${error.message}`);
    }
};

// You can also create other functions to fetch taxes, similar to how you fetch discounts
export const fetchAllTaxes = async () => {
    const db = getDatabase();
    const taxesRef = ref(db, "taxes");

    try {
        const snapshot = await get(taxesRef);
        if (snapshot.exists()) {
            console.log("Fetched Taxes:", snapshot.val());
            return Object.values(snapshot.val());
        } else {
            console.log("No taxes found");
            return [];
        }
    } catch (error) {
        console.error("Error fetching taxes:", error);
        throw new Error(`Error fetching taxes: ${error.message}`);
    }
};


//! End of AddNewTax

export const addQrcodeToDatabase = async (qrcode, qrcodeBase64) => {
    try {
        const db = getDatabase();
        const qrCodeRef = ref(db, `qrcodes/${qrcode}`);  // Save QR code under a separate `qrcodes` node
        await set(qrCodeRef, {
            qrcodeBase64,
            createdAt: Date.now(),
        });

        console.log('QR Code added to the database successfully.');
    } catch (error) {
        console.error('Error adding QR Code:', error);
        throw new Error('Failed to add QR Code.');
    }
};

export const checkQrcodeExists = async (qrcodeBase64) => {
    try {
        const db = getDatabase();
        const qrcodesRef = ref(db, 'qrcodes');
        const snapshot = await get(qrcodesRef);

        if (snapshot.exists()) {
            const qrcodes = snapshot.val();
            // Check if the Base64 string already exists in the database
            return Object.values(qrcodes).some(qrcode => qrcode.qrcodeBase64 === qrcodeBase64);
        }
        return false;
    } catch (error) {
        console.error('Error checking for existing QR Code:', error);
        throw new Error('Error checking QR Code existence.');
    }
};

export const fetchQrcodesFromDatabase = async () => {
    try {
        const db = getDatabase();
        const qrcodesRef = ref(db, 'qrcodes'); // Reference to the qrcodes node in your database
        const snapshot = await get(qrcodesRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const qrcodes = Object.keys(data).map((key) => ({
                id: key,
                qrcodeBase64: data[key]?.qrcodeBase64 || '', // QR code image
                productName: data[key]?.productName || '' // Include product name directly
            }));

            return qrcodes; // Return an array of QR code objects with product names
        } else {
            return []; // No QR codes found
        }
    } catch (error) {
        console.error('Error fetching QR codes from the database:', error);
        throw new Error('Failed to fetch QR codes');
    }
};

export const saveProductName = async (qrId, productName) => {
    try {
        // Get a reference to the Realtime Database
        const db = getDatabase();

        // Reference to the specific QR code using qrId
        const qrRef = ref(db, 'qrcodes/' + qrId);

        // Update the productName field of the specific QR code
        await update(qrRef, { productName });

    } catch (error) {
        console.error('Error saving product name:', error);
        throw new Error('Error saving product name');
    }
};

// Fetch addedQuantityHistory for all products
export const fetchAddedQuantityHistory = (callback) => {
    const db = getDatabase();
    const productsRef = ref(db, 'products/'); // Reference to all products

    onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            // Extract addedQuantityHistory from each product
            const allAddedQuantityHistory = Object.values(data).reduce((acc, product) => {
                if (product.addedQuantityHistory) {
                    acc.push(...product.addedQuantityHistory);
                }
                return acc;
            }, []);

            callback(allAddedQuantityHistory); // Pass the combined history to the callback
        } else {
            callback(null); // Handle case where data doesn't exist
        }
    });
};



export const fetchSalesData = async () => {
    const db = getDatabase();
    const ordersRef = ref(db, 'TransactionHistory');  // Reference to TransactionHistory node

    try {
        const snapshot = await get(ordersRef);
        if (!snapshot.exists()) {
            console.log('No sales data found.');
            return [];
        }

        const orders = snapshot.val();

        // Convert orders object to array and map the fields needed
        const formattedSales = Object.keys(orders).map((key) => ({
            id: key,
            ...orders[key],
            quantitySold: orders[key].items.reduce((acc, item) => acc + item.quantitySold, 0), // Sum quantitySold for items
            totalAmount: parseFloat(orders[key].total) || 0, // Ensure totalAmount is a number
        }));

        console.log('Sales data retrieved:', formattedSales);
        return formattedSales;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        throw new Error(`Error fetching sales data: ${error.message}`);
    }
};






export const logSale = async ({ barcode, quantitySold, totalAmount }) => {
    const db = getDatabase();
    const ordersRef = ref(db, 'TransactionHistory');  // Reference to TransactionHistory node
    const productRef = ref(db, 'products/' + barcode); // Reference to specific product by barcode

    try {
        // Fetch the product data
        const productSnapshot = await get(productRef);
        if (!productSnapshot.exists()) {
            throw new Error('Product not found');
        }

        const productData = productSnapshot.val();
        const currentQuantity = productData.quantity || 0;

        // Check if enough stock is available
        if (currentQuantity < quantitySold) {
            throw new Error(`Insufficient stock. Current quantity: ${currentQuantity}`);
        }

        //! Adjust for Philippine Time (UTC +8)
        const today = new Date();
        const philippineOffset = 8 * 60; // Philippine Time Zone Offset (UTC +8)
        const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);
        const formattedToday = localTime.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // Log sale data in the orders node
        const newOrderRef = push(ordersRef);
        await set(newOrderRef, {
            barcode: barcode,
            productName: productData.productName,
            quantitySold: quantitySold,
            totalAmount: totalAmount,
            date: formattedToday,
        });

        // Use a transaction to safely update the product quantity (avoiding race conditions)
        await runTransaction(productRef, (currentProductData) => {
            if (currentProductData === null) {
                throw new Error('Product not found during stock update');
            }

            // Calculate the new quantity
            const newQuantity = currentProductData.quantity - quantitySold;

            // If the stock is not enough, cancel the transaction
            if (newQuantity < 0) {
                throw new Error('Insufficient stock during update');
            }

            // Return the updated product data
            return {
                ...currentProductData,
                quantity: newQuantity,
                lastUpdated: formattedToday
            };
        });

        console.log(`Sale logged successfully for barcode: ${barcode}`);
    } catch (error) {
        console.error('Error logging sale:', error.message);
        throw new Error(`Error logging sale: ${error.message}`);
    }
};


export const fetchTransactionHistory = async () => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, 'TransactionHistory/');  // Reference to the TransactionHistory node

    try {
        const snapshot = await get(transactionHistoryRef);

        if (!snapshot.exists()) {
            console.log("No transaction history found");
            return [];  // Return an empty array if no data is found
        }

        // Convert the snapshot to an array of transaction objects
        const transactionHistory = Object.values(snapshot.val());

        return transactionHistory;
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        throw new Error("Failed to fetch transaction history");
    }
};

export const saveTransactionHistory = async (orderDetails) => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, 'TransactionHistory/' + Date.now());  // Use timestamp as unique ID for the transaction

    try {
        await set(transactionHistoryRef, orderDetails);  // Save the order details to the database
        console.log("Transaction saved successfully");
    } catch (error) {
        console.error("Error saving transaction:", error);
        throw new Error(`Error saving transaction: ${error.message}`);
    }
};

// Fetch the sales data (COGS) between a specified date range
export const fetchSalesDataAndCOGS = async (startDate, endDate) => {
    const db = getDatabase();
    const ordersRef = ref(db, 'TransactionHistory'); // Reference to TransactionHistory

    try {
        const snapshot = await get(ordersRef);
        if (!snapshot.exists()) {
            console.log('No sales data found.');
            return 0; // If no sales data, return 0
        }

        const orders = snapshot.val();
        let totalCOGS = 0;

        // Calculate COGS by summing the totalAmount (which is the sales price) within the date range
        Object.keys(orders).forEach((key) => {
            const order = orders[key];
            const { date, totalAmount } = order;

            // Check if the order's date is within the selected range
            if (date >= startDate && date <= endDate) {
                totalCOGS += totalAmount; // Add up the total sales amount to calculate COGS
            }
        });

        console.log('COGS for the period:', totalCOGS);
        return totalCOGS;

    } catch (error) {
        console.error('Error fetching sales data:', error);
        throw new Error(`Error fetching sales data: ${error.message}`);
    }
};

// Fetch the beginning and ending inventory for a specific product
export const fetchProductInventory = async (productId) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + productId); // Reference to specific product by ID

    try {
        const snapshot = await get(productRef);
        if (!snapshot.exists()) {
            console.log('Product not found.');
            return { beginningInventory: 0, endingInventory: 0 }; // Return 0 if no product is found
        }

        const productData = snapshot.val();
        const beginningInventory = productData.quantity || 0;  // Assume productData.quantity holds current inventory
        const endingInventory = beginningInventory;  // You can adjust this logic to get the ending inventory based on stock movement

        return { beginningInventory, endingInventory };
    } catch (error) {
        console.error('Error fetching product inventory:', error);
        throw new Error(`Error fetching product inventory: ${error.message}`);
    }
};

// Calculate Inventory Turnover using the COGS and average inventory
export const calculateInventoryTurnover = async (productId, startDate, endDate) => {
    try {
        // Fetch COGS (Cost of Goods Sold) from sales data
        const cogs = await fetchSalesDataAndCOGS(startDate, endDate);

        // Fetch Beginning and Ending Inventory for the product
        const { beginningInventory, endingInventory } = await fetchProductInventory(productId);

        if (beginningInventory === 0 || endingInventory === 0 || cogs === 0) {
            console.log('Insufficient data to calculate Inventory Turnover.');
            return 0; // Return 0 if any data is missing
        }

        // Calculate Average Inventory
        const averageInventory = (beginningInventory + endingInventory) / 2;

        // Calculate Inventory Turnover
        const turnover = cogs / averageInventory;

        console.log(`Inventory Turnover: ${turnover}`);
        return turnover;

    } catch (error) {
        console.error('Error calculating Inventory Turnover:', error);
    }
};

export const fetchQuantitySoldByRange = async (timeRange) => {
    const db = getDatabase();
    const ordersRef = ref(db, 'TransactionHistory'); // Reference to TransactionHistory node

    try {
        const snapshot = await get(ordersRef);
        if (!snapshot.exists()) {
            console.log('No sales data found.');
            return 0; // Return 0 if no data
        }

        const orders = snapshot.val();
        const now = new Date();
        let startDate, endDate;

        // Calculate the start and end date for the given range
        switch (timeRange) {
            case "Today":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = now;
                break;
            case "7 Days":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
                endDate = now;
                break;
            case "Month":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case "Year":
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                return 0;
        }

        // Calculate the total quantity sold within the date range
        const totalQuantity = Object.keys(orders).reduce((acc, key) => {
            const order = orders[key];
            const orderDate = new Date(order.date);

            if (orderDate >= startDate && orderDate <= endDate) {
                // Sum up the quantity of items sold in the order
                const quantitySold = order.items.reduce((sum, item) => sum + item.quantity, 0); // Use item.quantity directly
                acc += quantitySold;
            }
            return acc;
        }, 0);

        return totalQuantity;
    } catch (error) {
        console.error('Error fetching quantity sold:', error);
        throw new Error(`Error fetching quantity sold: ${error.message}`);
    }
};

// Function to get products added or updated today
export const getTodaysProductActivity = async () => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');

    try {
        // Get today's date range (from 12:00 AM to 11:59 PM)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // Start of today
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); // End of today

        const snapshot = await get(productsRef);
        if (!snapshot.exists()) {
            console.log("No products added/updated today.");
            return []; // Return an empty array if no products are found
        }

        const products = snapshot.val();
        const formattedToday = todayStart.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        const formattedProducts = Object.keys(products).map(key => {
            const product = products[key];

            // Ensure valid product data
            if (!product || typeof product !== 'object') return null;

            // Check today's added and deducted quantities
            const addedQuantityEntry = (product.addedQuantityHistory || []).find(entry => entry.date === formattedToday) || { quantity: 0 };
            const deductedQuantityEntry = (product.deductedQuantityHistory || []).find(entry => entry.date === formattedToday) || { quantity: 0 };

            return {
                name: product.name || 'Unnamed Product',
                price: product.price || 0,
                quantity: product.quantity || 0,
                addedToday: addedQuantityEntry.quantity,
                deductedToday: deductedQuantityEntry.quantity,
            };
        }).filter(product => product !== null);

        console.log("Today's Product Activity:", formattedProducts);
        return formattedProducts;
    } catch (error) {
        console.error("Error retrieving today's products:", error);
        throw new Error(`Error retrieving today's products: ${error.message}`);
    }
};

