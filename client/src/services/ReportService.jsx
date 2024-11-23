import { getDatabase, ref, set, get, update, remove, onValue, push, runTransaction } from 'firebase/database';


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
}


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
            quantitySold: orders[key].totalQuantity, // Use totalQuantity directly
            totalAmount: parseFloat(orders[key].total) || 0, // Ensure totalAmount is a number
        }));

        console.log('Sales data retrieved:', formattedSales);
        return formattedSales;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        throw new Error(`Error fetching sales data: ${error.message}`);
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
                startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
                endDate = new Date(); // Current time
                break;
            case "7 Days":
                startDate = new Date(now.setDate(now.getDate() - 6)); // 7 days ago
                endDate = new Date(); // Current time
                break;
            case "Month":
                startDate = new Date(now.setDate(1)); // Start of this month
                endDate = new Date(now.setMonth(now.getMonth() + 1, 0)); // End of this month
                break;
            case "Year":
                startDate = new Date(now.setMonth(0, 1)); // Start of the year
                endDate = new Date(now.setMonth(11, 31)); // End of the year
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
                const quantitySold = order.items.reduce((sum, item) => sum + item.quantity, 0);
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


// Fetch all products data from Firebase
export const fetchProductsData = async () => {
    const db = getDatabase();
    const productsRef = ref(db, 'products');  // Adjust the path as per your Firebase structure

    try {
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
            // Assuming each product has fields: quantity and price
            return Object.values(snapshot.val()); // Return an array of products
        } else {
            throw new Error('No products data found');
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        throw error;  // Rethrow the error to be handled in the component
    }
};