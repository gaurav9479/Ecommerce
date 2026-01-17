import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products"); // products or orders
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/admin/my-products`,
          { withCredentials: true }
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/orders/admin/all`,
          { withCredentials: true }
        )
      ]);

      setProducts(productsRes.data?.data || []);
      setOrders(ordersRes.data?.data?.orders || []);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Order status updated");
      fetchData(); 
    } catch (error) {
      console.error("Error updating status", error);
      toast.error("Failed to update status");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f1f3f6]">
        <div className="text-gray-600 font-medium text-lg">Loading Seller Hub...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-12 font-sans text-[#212121]">
      <div className="max-w-[1400px] mx-auto p-6">

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Performace overview & management</p>
          </div>
          <Link
            to="/admin/products"
            className="bg-[#2874f0] hover:bg-blue-600 text-white px-5 py-2.5 rounded-sm font-semibold shadow-sm transition text-sm flex items-center gap-2"
          >
            <span>+</span> Add New Listing
          </Link>
        </div>


        <div className="bg-white shadow-sm rounded-t-lg border-b border-gray-200 px-6 flex items-center gap-8 mb-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-4 font-medium text-sm transition relative ${
              activeTab === "products"
                ? "text-[#2874f0]"
                : "text-gray-600 hover:text-[#2874f0]"
            }`}
          >
            My Listings
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2874f0] rounded-t-md"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-4 font-medium text-sm transition relative ${
              activeTab === "orders"
                ? "text-[#2874f0]"
                : "text-gray-600 hover:text-[#2874f0]"
            }`}
          >
            Active Orders
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs ml-2 font-semibold">
              {orders.length}
            </span>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2874f0] rounded-t-md"></span>
            )}
          </button>
        </div>


        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
          

          {activeTab === "products" && (
            <div>
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-medium">No active listings</p>
                  <p className="text-gray-500 text-sm mt-1 max-w-xs">Start selling by adding your first product to the marketplace.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Product Details</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Inventory</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded border border-gray-200 p-0.5 bg-white shrink-0">
                                <img
                                  src={product.image?.[0] || "/placeholder.png"}
                                  alt={product.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <span className="font-medium text-gray-800 line-clamp-1 max-w-[200px]" title={product.title}>
                                {product.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">₹{product.price.toLocaleString()}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                <span className="text-gray-700">{product.stock} units</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 capitalize text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {product.stock > 0 ? (
                               <span className="text-green-600 text-xs font-bold uppercase tracking-wide">Active</span>
                            ) : (
                               <span className="text-red-500 text-xs font-bold uppercase tracking-wide">Inactive</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


          {activeTab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-medium">No orders yet</p>
                  <p className="text-gray-500 text-sm mt-1">Your orders will appear here once customers make a purchase.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4 w-[250px]">Product Info</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-gray-500">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex -space-x-3 hover:space-x-0 transition-all duration-300">
                              {order.items.slice(0, 4).map((item, i) => (
                                <img
                                  key={i}
                                  src={item.product?.image?.[0]}
                                  alt={item.product?.title}
                                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-gray-100"
                                  title={item.product?.title}
                                />
                              ))}
                              {order.items.length > 4 && (
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 z-10">
                                  +{order.items.length - 4}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 pl-1">
                                {order.items.length} item(s)
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{order.user?.Name || "Guest User"}</div>
                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                             <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                              ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }
                            `}>
                              {order.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>}
                              {order.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="bg-white border border-gray-300 text-gray-700 text-xs rounded-sm px-2 py-1.5 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none cursor-pointer hover:border-gray-400 transition"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
