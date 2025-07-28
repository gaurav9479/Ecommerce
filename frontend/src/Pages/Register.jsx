// src/Pages/Register.jsx
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const url = "http://localhost:9000/api/v1/users/register";
      const payload = { Name: name, email, phone, password }; 
      const res = await axios.post(url, payload, { withCredentials: true });

      const user = res?.data?.data;
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Welcome, ${user.Name || "User"}!`);
        navigate("/");
      } else {
        toast.error("Registration failed: No user returned.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed.";
      toast.error(msg);
      console.error("❌ Register Error:", msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cherryWine">
      <div className="bg-crimsonPlum p-10 rounded-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300"
            required
          />
          <input
            type="number"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300"
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300"
            required
          />

          <button
            type="submit"
            className="w-full bg-cherryWine text-white py-2 rounded-md hover:bg-crimsonPlum transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cherryWine hover:text-white underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
