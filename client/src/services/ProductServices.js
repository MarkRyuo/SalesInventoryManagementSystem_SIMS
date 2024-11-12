import { getDatabase, ref, set, get } from 'firebase/database';

// Function to add a new tax
export const addNewTax = async ({ taxName, taxValue }) => {
    const db = getDatabase();
    const taxId = Date.now();
    const taxRef = ref(db, `taxes/${taxId}`);

    try {
        await set(taxRef, {
            id: taxId,
            name: taxName,
            value: taxValue,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        throw new Error(`Error adding tax: ${error.message}`);
    }
};

// Function to fetch all taxes
export const fetchAllTaxes = async () => {
    const db = getDatabase();
    const taxesRef = ref(db, "taxes");

    try {
        const snapshot = await get(taxesRef);
        return snapshot.exists() ? Object.values(snapshot.val()) : [];
    } catch (error) {
        throw new Error(`Error fetching taxes: ${error.message}`);
    }
};
