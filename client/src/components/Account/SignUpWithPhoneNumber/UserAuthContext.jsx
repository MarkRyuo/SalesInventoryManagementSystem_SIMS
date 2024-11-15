/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../../services/firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState(null);


    // Updated setUpRecaptcha function
    function setUpRecaptha(number) {
    // Make sure recaptchaVerifier is only created once
    const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {},
    );

    recaptchaVerifier.render()
    return signInWithPhoneNumber(auth, number, recaptchaVerifier)
}


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            console.log("Auth State Changed:", currentuser);
            setUser(currentuser || null);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <userAuthContext.Provider
            value={{
                user,
                setUpRecaptha,
            }}
        >
            {children}
        </userAuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserAuth() {
    return useContext(userAuthContext);
}
