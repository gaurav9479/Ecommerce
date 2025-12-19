import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const { data } = await axios.get('/api/v1/cart', { withCredentials: true });
            setCart(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cart", error);
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`/api/v1/cart/remove/${productId}`, { withCredentials: true });
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error("Error removing item", error);
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
    };

    if (loading) return <div className="text-center mt-10">Loading Cart...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
            {!cart || cart.items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        {cart.items.map((item) => (
                            <div key={item._id} className="flex justify-between items-center bg-white p-4 shadow mb-4 rounded">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={item.product?.image?.[0]} 
                                        alt={item.product?.title} 
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg">{item.product?.title}</h3>
                                        <p className="text-gray-600">Qty: {item.quantity}</p>
                                        <p className="text-gray-800 font-bold">${item.product?.price}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.product._id)}
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="w-full md:w-1/3 bg-white p-6 shadow rounded h-fit">
                        <h2 className="text-xl font-bold mb-4">Summary</h2>
                        <div className="flex justify-between mb-4">
                            <span>Subtotal</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <button 
                            onClick={() => navigate('/payment')}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
