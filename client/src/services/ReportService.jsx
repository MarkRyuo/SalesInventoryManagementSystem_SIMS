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