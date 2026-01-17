import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/cart`, 
                { withCredentials: true }
            );
            setCart(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cart", error);
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/cart/remove/${productId}`, 
                { withCredentials: true }
            );
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error("Error removing item", error);
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity, oldQuantity) => {
        if (newQuantity < 0) return;
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/cart/update`,
                { productId, quantity: newQuantity },
                { withCredentials: true }
            );
            
            if (newQuantity < oldQuantity) {
                toast.success('Quantity reduced');
            } else if (newQuantity > oldQuantity) {
                toast.success('Quantity increased');
            }
            
            fetchCart();
        } catch (error) {
            console.error("Error updating quantity", error);
            toast.error('Failed to update quantity');
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
    };

    if (loading) return <div className="text-center mt-10">Loading Cart...</div>;

    return (
        <div className="min-h-screen bg-slate-900 animate-fadeIn section-padding">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 animate-slideUp">
                    <div>
                        <h1 className="text-5xl font-extrabold gradient-text mb-2">My Shopping Cart</h1>
                        <p className="text-slate-400">Review your selection before checkout</p>
                    </div>
                    {cart?.items?.length > 0 && (
                        <button 
                            onClick={() => navigate('/products')} 
                            className="btn-secondary flex items-center gap-2 group"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Continue Shopping
                        </button>
                    )}
                </div>

                {!cart || cart.items.length === 0 ? (
                    <div className="glass rounded-3xl p-16 text-center animate-slideUp">
                        <div className="text-8xl mb-6 animate-float inline-block">🛒</div>
                        <h2 className="text-3xl font-bold text-white mb-4">Your cart is feeling light</h2>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">Explore our premium collection and find something that speaks to you.</p>
                        <button 
                            onClick={() => navigate('/products')}
                            className="btn-primary"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4 animate-slideUp">
                            {cart.items.map((item, index) => (
                                <div 
                                    key={item._id} 
                                    className="glass rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:scale-[1.01] transition-transform duration-300 border border-slate-700/50"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative group overflow-hidden rounded-xl w-full sm:w-32 h-32">
                                        <img 
                                            src={item.product?.image?.[0]} 
                                            alt={item.product?.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{item.product?.title}</h3>
                                                <p className="text-slate-400 text-sm mb-4">{item.product?.category}</p>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Remove Item"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1, item.quantity)}
                                                    className="w-8 h-8 flex items-center justify-center text-white bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1, item.quantity)}
                                                    className="w-8 h-8 flex items-center justify-center text-white bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-2xl font-bold gradient-text">
                                                ₹{(item.product?.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1 border-slate-700">
                            <div className="glass-strong rounded-3xl p-8 sticky top-24 border border-slate-700/50 animate-slideInRight">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    Summary
                                    <div className="h-px flex-1 bg-slate-700/50 ml-2" />
                                </h2>
                                
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-slate-400">
                                            <span>Subtotal</span>
                                            <span className="text-white font-medium">₹{calculateTotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Shipping</span>
                                            <span className="text-success font-medium">Free</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Tax</span>
                                            <span className="text-white font-medium">₹0.00</span>
                                        </div>
                                    <div className="h-px bg-slate-700/50 my-4" />
                                    <div className="flex justify-between text-xl font-bold">
                                        <span className="text-white">Total</span>
                                        <span className="gradient-text">₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate('/checkout-details')}
                                    className="w-full btn-primary group flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                                
                                <p className="text-center text-slate-500 text-xs mt-6">
                                    Secure Checkout Powered by Stripe
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
