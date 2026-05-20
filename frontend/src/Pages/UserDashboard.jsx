import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useWishlist } from "../Context/WishlistContext";
import api from "../axios.service/authService";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const UserDashboard = () => {
    const { user, setUser, logout } = useAuth();
    const { wishlistItems } = useWishlist();
    const [activeTab, setActiveTab] = useState("profile");
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        if (user) setFormData({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    }, [user]);

    useEffect(() => {
        if (activeTab === "orders") fetchOrders();
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const { data } = await api.get("/orders/my-orders");
            setOrders(data.data.orders || []);
        } catch {
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
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        try {
            await api.delete("/users/delete");
            await logout();
            navigate("/login");
            toast.success("Account deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        }
    };

    const TABS = [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "orders", label: "Orders", icon: "📦" },
        { id: "settings", label: "Settings", icon: "⚙️" },
    ];

    const statusColor = (status) => {
        if (status === 'Delivered') return 'badge-success';
        if (status === 'Cancelled') return 'badge-error';
        if (status === 'Shipped') return 'badge-info';
        return 'badge-warning';
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container-custom max-w-6xl">
                {/* Top stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slideUp">
                    {[
                        { label: 'Total Orders', value: orders.length, icon: '📦' },
                        { label: 'Wishlist Items', value: wishlistItems.length, icon: '💗' },
                        { label: 'Reviews Given', value: '—', icon: '⭐' },
                        { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024', icon: '🎉' },
                    ].map((s, i) => (
                        <div key={i} className="glass rounded-xl p-5 text-center hover:scale-105 transition-all">
                            <div className="text-3xl mb-2">{s.icon}</div>
                            <div className="text-2xl font-black gradient-text">{s.value}</div>
                            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="md:w-64 flex-shrink-0">
                        <div className="glass rounded-2xl p-6 sticky top-24">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 gradient-bg rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black shadow-glow">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="mt-4 font-bold text-white text-lg">{user?.name}</h2>
                                <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
                                <span className="badge badge-success mt-2 text-xs">✓ Verified</span>
                            </div>

                            {/* Nav */}
                            <nav className="space-y-2">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all font-medium text-sm ${
                                            activeTab === tab.id
                                                ? 'gradient-bg text-white shadow-glow'
                                                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 animate-fadeIn">

                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="glass rounded-2xl p-8">
                                <h3 className="text-2xl font-bold gradient-text mb-8">Edit Profile</h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                    {[
                                        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                                        { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
                                        { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">{field.label}</label>
                                            <input
                                                type={field.type}
                                                value={formData[field.key]}
                                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                placeholder={field.placeholder}
                                                className="input-field"
                                            />
                                        </div>
                                    ))}
                                    <button type="submit" className="btn-primary w-full">
                                        💾 Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div className="glass rounded-2xl p-8">
                                <h3 className="text-2xl font-bold gradient-text mb-8">Order History</h3>
                                {loadingOrders ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="skeleton h-24 rounded-xl" />
                                        ))}
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-6xl mb-4">📦</div>
                                        <h4 className="text-xl font-bold text-white mb-2">No orders yet</h4>
                                        <p className="text-slate-400 mb-6">Start shopping to see your orders here!</p>
                                        <Link to="/products" className="btn-primary">Shop Now</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order._id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="font-bold text-white font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <span className={`badge ${statusColor(order.status)}`}>{order.status}</span>
                                                </div>
                                                <div className="border-t border-slate-700/50 pt-3 mt-2">
                                                    {order.items?.slice(0, 2).map((item, idx) => (
                                                        <p key={idx} className="text-sm text-slate-400 truncate">
                                                            {item.quantity}× {item.product?.title || "Product"}
                                                        </p>
                                                    ))}
                                                    {order.items?.length > 2 && (
                                                        <p className="text-xs text-slate-600">+{order.items.length - 2} more items</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                                                    <span className="font-bold gradient-text text-lg">₹{order.totalAmount?.toLocaleString()}</span>
                                                    <Link
                                                        to={`/order-tracking/${order._id}`}
                                                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
                                                    >
                                                        Track Order →
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <div className="glass rounded-2xl p-8 space-y-6">
                                <h3 className="text-2xl font-bold gradient-text mb-8">Account Settings</h3>

                                {/* Theme */}
                                <div className="bg-slate-800/50 rounded-xl p-6">
                                    <h4 className="font-semibold text-white text-lg mb-2 flex items-center gap-2">
                                        <span>🎨</span> Theme Preferences
                                    </h4>
                                    <p className="text-slate-400 text-sm mb-4">Personalize your shopping experience.</p>
                                    <Link to="/themes" className="btn-secondary text-sm">
                                        Open Theme Picker →
                                    </Link>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                                    <h4 className="font-semibold text-red-400 text-lg mb-2 flex items-center gap-2">
                                        <span>⚠️</span> Danger Zone
                                    </h4>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Once you delete your account, all your data will be permanently removed.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        🗑️ Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
