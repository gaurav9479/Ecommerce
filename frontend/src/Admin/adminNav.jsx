import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link to="/">GLIPKART</Link>
      </div>

      <ul className="flex gap-6 items-center">
        {isAdmin ? (
          <>
            <li>
              <Link to="/admin/dashboard" className="hover:text-yellow-400">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/products" className="hover:text-yellow-400">Add Product</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="hover:text-yellow-400">Login</Link>
            </li>
            <li>
              <Link to="/register" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded font-medium">
                Register as Vendor
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
