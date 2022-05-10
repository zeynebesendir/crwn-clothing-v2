import { createContext, useState, useEffect } from "react";
import {
    onAuthStateChangedListener,
    createUserDocumentFromAuth
} from "../utils/firebase/firebase.utils";

//the actual value that wanted to accessd
export const UserContext = createContext({
    currentUser: null, //set initial empty 
    setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser };

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            if (user) {
                //create document for the user
                createUserDocumentFromAuth(user);
            }
            setCurrentUser(user);
        });

        return unsubscribe;
    }, []);

    //When context updated component will rerender - as the prop is updating/state is updating
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};