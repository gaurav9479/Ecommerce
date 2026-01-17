import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/wishlist`,
                { withCredentials: true }
            );
            setWishlistItems(response.data.data?.products || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => (item._id || item) === productId);
    };

    const toggleWishlist = async (productId) => {
        if (!user) return false;
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/wishlist/toggle`,
                { productId },
                { withCredentials: true }
            );
            
            // Refresh local state
            await fetchWishlist();
            return response.data.data.action === 'added';
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            throw error;
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, isInWishlist, toggleWishlist, loading, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
