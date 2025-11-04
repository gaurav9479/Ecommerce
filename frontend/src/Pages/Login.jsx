import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!identifier) {
      toast.error("Please enter email or phone number");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/auth/send-otp`,
        { identifier }
      );
      toast.success("OTP sent successfully!");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/auth/verify-otp`,
        { identifier, otp },
        { withCredentials: true }
      );

      const user = res?.data?.data?.user;
      if (!user) throw new Error("Invalid response from server");

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome, ${user.Name || "User"}!`);
      navigate(user.isAdmin ? "/admin/dashboard" : "/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cherryWine">
      <div className="bg-crimsonPlum p-10 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {step === 1 ? "User Login" : "Verify OTP"}
        </h2>

        {step === 1 ? (
          <form className="space-y-4" onSubmit={handleSendOTP}>
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300 focus:ring-2 focus:ring-cherryWine"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-cherryWine hover:bg-crimsonPlum text-white"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerifyOTP}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-darkPlum text-white placeholder:text-gray-300 focus:ring-2 focus:ring-cherryWine"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-cherryWine hover:bg-crimsonPlum text-white"
              }`}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <p
              onClick={() => setStep(1)}
              className="text-sm text-gray-300 underline cursor-pointer text-center"
            >
              Resend OTP
            </p>
          </form>
        )}

        <p className="text-sm text-gray-300 mt-4 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-cherryWine hover:text-white underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
