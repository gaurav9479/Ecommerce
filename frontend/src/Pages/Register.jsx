// src/Pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, isAdmin } = form;

    if (!name || !email || !phone || !password) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/users/register`,
        { Name: name, email, phone, password, isAdmin },
        { withCredentials: true }
      );

      const user = res?.data?.data;
      if (!user) throw new Error("No user returned from API");

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome, ${user.Name || "User"}!`);

      navigate(user.isAdmin ? "/admin/dashboard" : "/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed.";
      toast.error(msg);
      console.error("❌ Register Error:", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cherryWine">
      <div className="bg-crimsonPlum p-10 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create an Account</h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cherryWine"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cherryWine"
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cherryWine"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cherryWine"
            required
          />

          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              name="isAdmin"
              checked={form.isAdmin}
              onChange={handleChange}
              className="form-checkbox accent-cherryWine"
            />
            <span>Register as Admin</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-cherryWine hover:bg-crimsonPlum text-white"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cherryWine hover:text-white underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
