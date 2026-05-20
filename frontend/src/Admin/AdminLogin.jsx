import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginRecruiter } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(emailOrPhone, password);
      
      if (user.role !== "admin") {
        toast.error("This login is for admin/vendors only");
        return;
      }
      
      navigate("/admin/dashboard");
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterLogin = async (role) => {
    setLoading(true);
    try {
      const user = await loginRecruiter(role);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/products");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Vendor Login</h2>
        <p className="text-gray-400 text-center mb-6">Access your seller dashboard</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-400">
            Want to become a vendor?{" "}
            <Link to="/admin/register" className="text-yellow-400 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-gray-500 text-sm">
            <Link to="/" className="hover:text-white">
              ← Back to store
            </Link>
          </p>
        </div>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider text-opacity-80">Recruiter Demo Mode</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleRecruiterLogin("user")}
            disabled={loading}
            className="py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            🔑 Customer Demo
          </button>
          <button
            type="button"
            onClick={() => handleRecruiterLogin("admin")}
            disabled={loading}
            className="py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            🏪 Vendor Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
