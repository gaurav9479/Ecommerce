import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // make sure you have react-hot-toast installed

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); // small "n" to match your Mongoose model
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:9000/api/v1/users/login"
        : "http://localhost:9000/api/v1/users/register";

      const payload = isLogin
        ? { phone, password }
        : { name, email, phone, password };

      const res = await axios.post(url, payload, { withCredentials: true });

      const user = res?.data?.data?.user;

      if (user) {
        // Update context + localStorage
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        // Success feedback
        toast.success(`Welcome, ${user.name || "User"}!`);
        navigate("/"); // Redirect to home
      } else {
        toast.error("Login failed: No user data");
        console.error("⚠️ Unexpected response:", res?.data);
      }

    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Login failed. Try again.";
      toast.error(errorMessage);
      console.error("❌ Login Error:", errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cherryWine">
      <div className="bg-crimsonPlum p-10 rounded-md w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex justify-between mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              isLogin ? "bg-cherryWine text-white" : "bg-darkPlum text-gray-300"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              !isLogin ? "bg-cherryWine text-white" : "bg-darkPlum text-gray-300"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300"
                required
              />
            </>
          )}
          <input
            type="number"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300"
            required
          />

          <button
            type="submit"
            className="w-full bg-cherryWine text-white py-2 rounded-md hover:bg-crimsonPlum transition"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
