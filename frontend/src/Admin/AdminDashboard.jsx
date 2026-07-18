import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import AnalyticsDashboard from "./AnalyticsDashboard";

const API = import.meta.env.VITE_API_URL || "http://localhost:9000";

const STATUS_COLORS = {
    Delivered: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', dot: '#10b981' },
    Processing: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', dot: '#3b82f6' },
    Shipped: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', dot: '#f59e0b' },
    Cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', dot: '#ef4444' },
};

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("analytics");
    const { user } = useAuth();
    const navigate = useNavigate();


    const [selectedProduct, setSelectedProduct] = useState(null);
    const [tempTotalStock, setTempTotalStock] = useState("");
    const [tempReservedStock, setTempReservedStock] = useState("");
    const [updatingStock, setUpdatingStock] = useState(false);

    const openStockModal = (product) => {
        setSelectedProduct(product);
        setTempTotalStock(product.totalStock ?? product.stock ?? 0);
        setTempReservedStock(product.reservedStock ?? 0);
    };

    const handleStockUpdate = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setUpdatingStock(true);
        try {
            const payload = {};
            if (tempTotalStock !== "" && tempTotalStock !== null) payload.totalStock = parseInt(tempTotalStock);
            if (tempReservedStock !== "" && tempReservedStock !== null) payload.reservedStock = parseInt(tempReservedStock);

            if (payload.reservedStock !== undefined && payload.totalStock !== undefined) {
                if (payload.reservedStock > payload.totalStock) {
                    throw new Error("Reserved stock cannot exceed total stock");
                }
            } else if (payload.reservedStock !== undefined && payload.totalStock === undefined) {
                if (payload.reservedStock > (selectedProduct.totalStock ?? selectedProduct.stock ?? 0)) {
                    throw new Error("Reserved stock cannot exceed current total stock");
                }
            } else if (payload.totalStock !== undefined && payload.reservedStock === undefined) {
                if ((selectedProduct.reservedStock ?? 0) > payload.totalStock) {
                    throw new Error("Total stock cannot be set below current reserved stock");
                }
            }

            await axios.patch(
                `${API}/api/v1/admin/products/${selectedProduct._id}/stock`,
                payload,
                { withCredentials: true }
            );
            toast.success("Inventory updated successfully!");
            setSelectedProduct(null);
            fetchData();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to update inventory");
        } finally {
            setUpdatingStock(false);
        }
    };

    // Flash Deal Management Modal State
    const [selectedFlashProduct, setSelectedFlashProduct] = useState(null);
    const [flashIsActive, setFlashIsActive] = useState(false);
    const [flashDiscount, setFlashDiscount] = useState("");
    const [flashDurationHours, setFlashDurationHours] = useState(6);
    const [updatingFlash, setUpdatingFlash] = useState(false);

    const openFlashModal = (product) => {
        setSelectedFlashProduct(product);
        setFlashIsActive(product.flashDeal?.isActive || false);
        setFlashDiscount(product.discount || "");
        
        if (product.flashDeal?.isActive && product.flashDeal?.expiresAt) {
            const diffMs = new Date(product.flashDeal.expiresAt) - Date.now();
            if (diffMs > 0) {
                setFlashDurationHours(Math.max(1, Math.round(diffMs / 3600000)));
            } else {
                setFlashDurationHours(6);
            }
        } else {
            setFlashDurationHours(6);
        }
    };

    const handleFlashUpdate = async (e) => {
        e.preventDefault();
        if (!selectedFlashProduct) return;
        setUpdatingFlash(true);
        try {
            await axios.patch(
                `${API}/api/v1/admin/products/${selectedFlashProduct._id}/flash-deal`,
                { 
                    isActive: flashIsActive, 
                    discount: Number(flashDiscount), 
                    durationHours: Number(flashDurationHours) 
                },
                { withCredentials: true }
            );
            toast.success("Flash deal configured successfully!");
            setSelectedFlashProduct(null);
            fetchData();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to configure flash deal");
        } finally {
            setUpdatingFlash(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== "admin") { navigate("/admin/login"); return; }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, ordersRes] = await Promise.all([
                axios.get(`${API}/api/v1/admin/my-products`, { withCredentials: true }),
                axios.get(`${API}/api/v1/orders/admin/all`, { withCredentials: true }),
            ]);
            setProducts(productsRes.data?.data || []);
            setOrders(ordersRes.data?.data?.orders || []);
        } catch {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axios.patch(`${API}/api/v1/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
            toast.success("Order status updated");
            fetchData();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const TABS = [
        { id: 'analytics', label: '📊 Analytics', count: null },
        { id: 'products', label: '🛒 Listings', count: products.length },
        { id: 'orders', label: '📦 Orders', count: orders.length },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
                <div className="text-sm font-medium text-gray-500">Loading Seller Hub...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif', color: '#1e293b' }}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">


                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Seller Hub</h1>
                        <p className="text-gray-500 text-xs mt-0.5">Welcome back, {user?.name} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchData} className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                            ↻ Refresh
                        </button>
                        <Link to="/admin/products" className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition hover:opacity-90"
                            style={{ backgroundColor: '#6366f1' }}>
                            + New Listing
                        </Link>
                    </div>
                </div>


                <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}>
                                {tab.label}
                                {tab.count !== null && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{
                                        backgroundColor: activeTab === tab.id ? 'rgba(99,102,241,0.1)' : '#f1f5f9',
                                        color: activeTab === tab.id ? '#6366f1' : '#64748b'
                                    }}>
                                        {tab.count}
                                    </span>
                                )}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] rounded-t bg-indigo-600" />
                                )}
                            </button>
                        ))}
                    </div>


                    {activeTab === 'analytics' && <AnalyticsDashboard />}


                    {activeTab === 'products' && (
                        <div className="overflow-x-auto">
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center">
                                    <p className="text-gray-500 text-sm font-medium">No listings yet</p>
                                    <p className="text-gray-400 text-xs mt-1">Add your first product to get started</p>
                                    <Link to="/admin/products" className="mt-4 text-xs font-semibold text-indigo-600 hover:underline">+ Add Product</Link>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <tr>
                                            {['Product', 'Price', 'Stock', 'Category', 'Flash Deal', 'Status'].map(h => (
                                                <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.map(p => (
                                            <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <img src={p.image?.[0] || ''} alt={p.title} onError={e => e.target.style.display = 'none'} className="w-10 h-10 rounded-lg object-cover border border-gray-100 bg-gray-50" />
                                                        <span className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">{p.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 font-semibold text-gray-800">₹{p.price?.toLocaleString()}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-2 h-2 rounded-full ${(p.availableStock ?? p.stock ?? 0) > 10 ? 'bg-green-500' : (p.availableStock ?? p.stock ?? 0) > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                                            <span className="text-gray-800 font-semibold text-xs">Avail: {p.availableStock ?? p.stock ?? 0}</span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 flex gap-2">
                                                            <span>Total: {p.totalStock ?? p.stock ?? 0}</span>
                                                            <span>•</span>
                                                            <span className="text-purple-600">Res: {p.reservedStock ?? 0}</span>
                                                            <button onClick={() => openStockModal(p)} className="ml-3 text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition">
                                                                Manage
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>{p.category}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button onClick={() => openFlashModal(p)} className={`text-xs px-2 py-1 rounded transition flex items-center gap-1 ${p.flashDeal?.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-200'}`}>
                                                        ⚡ {p.flashDeal?.isActive ? `${p.discount}% OFF` : 'Set Deal'}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs font-bold uppercase ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                        {p.stock > 0 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}


                    {activeTab === 'orders' && (
                        <div className="overflow-x-auto">
                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center">
                                    <p className="text-gray-500 text-sm font-medium">No orders yet</p>
                                    <p className="text-gray-400 text-xs mt-1">Orders will appear here once customers purchase.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <tr>
                                            {['Order ID', 'Items', 'Customer', 'Amount', 'Status', 'Update'].map(h => (
                                                <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.map(order => {
                                            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Processing;
                                            return (
                                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                        <div className="text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex -space-x-2">
                                                            {order.items.slice(0, 3).map((item, i) => (
                                                                <img key={i} src={item.product?.image?.[0]} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-100" />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-gray-400 mt-0.5 block">{order.items.length} item(s)</span>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <div className="font-medium text-gray-800">{order.user?.Name || 'Customer'}</div>
                                                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                                                    </td>
                                                    <td className="px-5 py-3.5 font-bold text-gray-800">₹{order.totalAmount?.toLocaleString()}</td>
                                                    <td className="px-5 py-3.5">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                                            style={{ backgroundColor: sc.bg, color: sc.color }}>
                                                            {order.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sc.dot }} />}
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <select value={order.status}
                                                            onChange={e => handleStatusUpdate(order._id, e.target.value)}
                                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-indigo-400 cursor-pointer hover:border-gray-300 transition">
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-3">Manage Inventory — {selectedProduct.title}</h3>
                            <form onSubmit={handleStockUpdate} className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-600">Total Stock</label>
                                    <input type="number" min="0" value={tempTotalStock} onChange={e => setTempTotalStock(e.target.value)} className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Reserved Stock</label>
                                    <input type="number" min="0" value={tempReservedStock} onChange={e => setTempReservedStock(e.target.value)} className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => setSelectedProduct(null)} className="px-3 py-2 rounded border">Cancel</button>
                                    <button type="submit" disabled={updatingStock} className="px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50">{updatingStock ? 'Saving...' : 'Save'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {selectedFlashProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">⚡ Flash Deal — {selectedFlashProduct.title}</h3>
                            <form onSubmit={handleFlashUpdate} className="space-y-4 mt-4">
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={flashIsActive} onChange={e => setFlashIsActive(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                    <span className="text-sm font-medium text-gray-700">{flashIsActive ? 'Deal Active' : 'Deal Inactive'}</span>
                                </div>
                                
                                {flashIsActive && (
                                    <>
                                        <div>
                                            <label className="text-xs text-gray-600 font-medium">Discount Percentage (%)</label>
                                            <input type="number" min="0" max="100" value={flashDiscount} onChange={e => setFlashDiscount(e.target.value)} required placeholder="e.g. 20" className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:border-orange-400" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 font-medium">Duration (Hours from now)</label>
                                            <select value={flashDurationHours} onChange={e => setFlashDurationHours(e.target.value)} className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:border-orange-400">
                                                <option value={1}>1 Hour (Quick Sale)</option>
                                                <option value={3}>3 Hours</option>
                                                <option value={6}>6 Hours</option>
                                                <option value={12}>12 Hours (Half Day)</option>
                                                <option value={24}>24 Hours (Full Day)</option>
                                                <option value={48}>48 Hours</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                
                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setSelectedFlashProduct(null)} className="px-4 py-2 rounded text-sm font-medium border border-gray-200 hover:bg-gray-50 transition">Cancel</button>
                                    <button type="submit" disabled={updatingFlash} className="px-4 py-2 rounded text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition">
                                        {updatingFlash ? 'Saving...' : 'Save Deal'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
