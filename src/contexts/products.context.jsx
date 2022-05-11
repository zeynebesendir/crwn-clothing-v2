import { createContext, useState, useEffect } from 'react';

import { addCollectionAndDocuments } from '../utils/firebase/firebase.utils';

import SHOP_DATA from '../shop-data.js';

export const ProductsContext = createContext({
    products: [],
});

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    /*
    CREATED TO CREATE CATEGORIES DATA IN THE DB
    -
    DATA CREATED AND NO NEED REWRITE TO DB

    useEffect(() => {
        addCollectionAndDocuments('categories', SHOP_DATA);
    }, []);*/

    const value = { products };
    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
};