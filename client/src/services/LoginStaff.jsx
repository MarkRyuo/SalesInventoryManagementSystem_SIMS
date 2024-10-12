import { db } from '../firebase'; //? firebaseConfig
import { getDocs, collection, query, where } from "firebase/firestore";

const LoginStaff = async (username, password, navigate) => {

    try {
        //? Access the staff collection
        const staffCollection = collection(db, "staffs");

        //? Create a query to find the staff user by username
        const q = query(staffCollection, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        console.log("Attempting to log in with staff username:", username);
        console.log("Staff Query Snapshot:", querySnapshot.docs); //? Log the snapshot

        //? Check if the staff user exists
        if (querySnapshot.empty) {
            throw new Error("Username not found."); //? Throw error instead of alert
        }

        //? Get the first matching staff user document
        const staffDoc = querySnapshot.docs[0];
        console.log("Staff User Document Data:", staffDoc.data()); //? Log user data
        const storedPassword = staffDoc.data().password;

        //? Check if the password matches
        if (storedPassword.trim() !== password.trim()) {
            throw new Error("Incorrect password."); //? Throw error instead of alert
        }

        //? Successful login
        const staffId = staffDoc.id; //? Use Firestore document ID as staff ID
        localStorage.setItem('staffId', staffId); //? Store the staff user's UID
        console.log("Staff user logged in:", staffId);

        //? Redirect after successful login
        navigate("/SDashboard"); //? Navigate to staff dashboard

    } catch (error) {
        console.error("Staff Login error:", error.message);
        throw error; // Rethrow the error for handling in the calling component
    }
};

export default LoginStaff;
