import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import api from "../axios.service/authService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const { user, setUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
            });
        }
    }, [user]);


    useEffect(() => {
        if (activeTab === "orders") {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const { data } = await api.get("/orders/my-orders"); 
            setOrders(data.data.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders", error);

            toast.error("Could not fetch orders");
        } finally {
            setLoadingOrders(false);
        }
    };


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.patch("/users/update-account", formData);
            setUser(data.data); 
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone immediately.")) return;

        try {
            await api.delete("/users/delete");
            await logout();
            navigate("/login");
            toast.success("Account deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow overflow-hidden min-h-[500px] flex flex-col md:flex-row">

                    <div className="w-full md:w-64 bg-gray-100 flex-shrink-0">
                        <div className="p-6 text-center border-b border-gray-200">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-indigo-600 text-2xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="mt-4 font-semibold text-gray-900">{user?.name}</h2>
                            <p className="text-sm text-gray-500">{user?.role}</p>
                        </div>
                        <nav className="p-4 space-y-2">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "profile" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                            >
                                <span>👤</span> Profile
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "orders" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                            >
                                <span>📦</span> Order History
                            </button>
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "settings" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                            >
                                <span>⚙️</span> Settings
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8">
                        {activeTab === "profile" && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h3>
                                {loadingOrders ? (
                                    <div className="text-center py-10">Loading orders...</div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">No orders found.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="border-t pt-2 mt-2">
                                                    {order.items?.slice(0, 2).map((item, idx) => (
                                                        <p key={idx} className="text-sm text-gray-600 truncate">
                                                            {item.quantity}x {item.product?.title || "Product"}
                                                        </p>
                                                    ))}
                                                    {order.items?.length > 2 && (
                                                        <p className="text-xs text-gray-400">+{order.items.length - 2} more items</p>
                                                    )}
                                                </div>
                                                <div className="mt-3 flex justify-between items-center text-sm">
                                                    <span className="font-semibold">Total: ${order.totalAmount}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
                                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                    <h4 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h4>
                                    <p className="text-sm text-red-600 mb-4">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
