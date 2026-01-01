import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../component/LoadingSkeleton';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/wishlist`,
                { withCredentials: true }
            );
            setWishlist(response.data.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            if (error.response?.status === 401) {
                // User not logged in, acceptable to just show empty or redirect
                // For now, let's just leave it null or redirect if we want strict access
            }
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/wishlist/remove/${productId}`,
                { withCredentials: true }
            );
            toast.success('Removed from wishlist');
            fetchWishlist(); // Refresh list
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const moveToCart = async (productId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/cart/add`,
                { productId, quantity: 1 },
                { withCredentials: true }
            );
            toast.success('Added to cart');
            // Optional: remove from wishlist after adding to cart
             removeFromWishlist(productId);
        } catch (error) {
             toast.error('Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="container-custom section-padding pt-24 min-h-screen">
                <LoadingSkeleton count={4} />
            </div>
        );
    }

    if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
        return (
            <div className="min-h-screen bg-slate-900 pt-24 px-4">
                <div className="container-custom text-center">
                    <div className="glass rounded-2xl p-12 max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Explorer our catalog and save your favorite items for later.
                        </p>
                        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                            Start Shopping
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4">
            <div className="container-custom">
                <h1 className="text-3xl font-bold text-white mb-8">My Wishlist ({wishlist.products.length})</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.products.map((product) => (
                        <div key={product._id} className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group">
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={product.image?.[0] || 'https://placehold.co/400x300'} 
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <button 
                                    onClick={() => removeFromWishlist(product._id)}
                                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
                                    title="Remove from wishlist"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="p-5">
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 hover:text-purple-400 transition-colors">
                                        {product.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xl font-bold text-purple-400">₹{product.price?.toLocaleString()}</span>
                                    {product.stock > 0 ? (
                                        <span className="text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded">In Stock</span>
                                    ) : (
                                        <span className="text-sm text-red-400 bg-red-400/10 px-2 py-1 rounded">Out of Stock</span>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => moveToCart(product._id)}
                                    disabled={product.stock <= 0}
                                    className="w-full btn-primary flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
