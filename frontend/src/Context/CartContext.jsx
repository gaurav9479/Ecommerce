import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/cart`,
                { withCredentials: true }
            );
            setCart(response.data.data || { items: [], totalPrice: 0 });
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) return false;
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/cart/add`,
                { productId, quantity },
                { withCredentials: true }
            );
            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/cart/remove/${productId}`,
                { withCredentials: true }
            );
            await fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
            throw error;
        }
    };

    const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, loading, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
