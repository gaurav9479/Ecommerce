import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      toast.error("Please fill all fields");
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/users/login`,
        { emailOrPhone, password },
        { withCredentials: true }
      );
      
      const user = data?.data?.user;
      if (!user) throw new Error("Invalid response");
      
      if (user.role !== "admin") {
        toast.error("This login is for admin/vendors only");
        return;
      }
      
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome back, ${user.name || "Admin"}!`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
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
            <Link to="/register" className="text-yellow-400 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-gray-500 text-sm">
            <Link to="/" className="hover:text-white">
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
