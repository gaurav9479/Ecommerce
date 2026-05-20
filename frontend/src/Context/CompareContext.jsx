import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('compareList')) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product) => {
        if (compareList.length >= 4) {
            toast.error('You can compare up to 4 products at a time');
            return;
        }
        if (compareList.find(p => p._id === product._id)) {
            toast('Already in compare list', { icon: 'ℹ️' });
            return;
        }
        setCompareList(prev => [...prev, product]);
        toast.success(`${product.title} added to compare`);
    };

    const removeFromCompare = (productId) => {
        setCompareList(prev => prev.filter(p => p._id !== productId));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    const isInCompare = (productId) => {
        return compareList.some(p => p._id === productId);
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) throw new Error('useCompare must be used within CompareProvider');
    return context;
};
