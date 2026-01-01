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
    <nav className="bg-[#2874f0] text-white shadow-sm px-6 py-3 flex justify-between items-center z-50 sticky top-0 h-[64px]">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex flex-col items-center leading-none">
          <span className="text-xl font-bold italic tracking-wide">GLIPKART</span>
          <span className="text-[10px] italic text-gray-200 flex items-center gap-1 font-medium">
            Seller <span className="text-yellow-400 font-bold">Hub</span>
          </span>
        </Link>
      </div>

      <ul className="flex gap-8 items-center text-[15px] font-medium">
        {isAdmin ? (
          <>
            <li>
              <Link to="/admin/dashboard" className="hover:text-gray-100 transition">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/products" className="hover:text-gray-100 transition">Inventory</Link>
            </li>
            <li>
              <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <span className="text-sm font-normal text-gray-100 hidden md:block">
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-[#2874f0] hover:bg-gray-100 px-5 py-1.5 rounded-sm font-semibold text-sm transition shadow-sm"
                >
                  Logout
                </button>
              </div>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="hover:text-gray-100 transition">Login</Link>
            </li>
            <li>
              <Link to="/register" className="bg-white text-[#2874f0] hover:bg-gray-100 px-6 py-2 rounded-sm font-semibold shadow-sm transition">
                Start Selling
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
