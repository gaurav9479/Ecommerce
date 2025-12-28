import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/admin/my-products`,
        { withCredentials: true }
      );
      setProducts(data?.data || []);
    } catch (error) {
      console.error("Error fetching products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name || "Vendor"}!</h1>
        <p className="text-gray-400 mt-1">Manage your products and orders from here</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide">Total Products</h3>
          <p className="text-4xl font-bold mt-2">{products.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide">In Stock</h3>
          <p className="text-4xl font-bold mt-2 text-green-400">
            {products.filter((p) => p.stock > 0).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide">Out of Stock</h3>
          <p className="text-4xl font-bold mt-2 text-red-400">
            {products.filter((p) => p.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Products</h2>
          <Link
            to="/admin/products"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-medium"
          >
            + Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products yet</p>
            <p className="text-gray-500 mt-2">Start by adding your first product</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">Image</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">Title</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">Price</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">Category</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4">
                      <img
                        src={product.image?.[0] || "/placeholder.png"}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4">{product.title}</td>
                    <td className="py-3 px-4">₹{product.price}</td>
                    <td className="py-3 px-4 capitalize">{product.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          product.stock > 0
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
