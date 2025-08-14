import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens or session if needed
    // For example:
    // localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link to="/">GLIPKART</Link>
      </div>

      <ul className="flex gap-6">
        <li>
          <Link to="/admin/dashboard" className="hover:text-yellow-400">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/products" className="hover:text-yellow-400">PRODUCTS</Link>
        </li>
        <li>
          <Link to="/admin/products" className="hover:text-yellow-400">ADD PRODUCT</Link>
        </li>
        <li>
          <Link to="/admin/orders" className="hover:text-yellow-400">Orders</Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
