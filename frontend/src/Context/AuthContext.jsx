import { createContext, useContext, useEffect, useState } from "react";
import api from "../axios.service/authService";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/me", { _skipRedirect: true });
        setUser(data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (emailOrPhone, password) => {
    try {
      const { data } = await api.post("/users/login", { emailOrPhone, password });
      const user = data.data.user;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome back, ${user.name || "user"}!`);
      return user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (err) {
      console.warn("Backend logout returned error, clearing local state anyway");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    }
  };

  const loginRecruiter = async (role) => {
    const isVendor = role === "admin";
    const email = isVendor ? "recruiter.vendor@glipkart.com" : "recruiter.user@glipkart.com";
    const phone = isVendor ? "8888888888" : "9999999999";
    const name = isVendor ? "Recruiter Demo Vendor" : "Recruiter Demo User";
    const password = "password123";

    try {
      const { data } = await api.post("/users/login", { emailOrPhone: email, password });
      const loggedUser = data.data.user;
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      toast.success(`Welcome back, ${loggedUser.name || "recruiter"}!`);
      return loggedUser;
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const registerPayload = {
            name,
            email,
            password,
            phone,
            role,
          };
          if (isVendor) {
            registerPayload.shopDetails = {
              shopName: "Demo Tech Hub",
              gstNumber: "22AAAAA0000A1Z5",
              address: "Tech Park, Bengaluru"
            };
          }
          const { data: regData } = await api.post("/users/register", registerPayload);
          const registeredUser = regData.data.user;
          setUser(registeredUser);
          localStorage.setItem("user", JSON.stringify(registeredUser));
          toast.success(`Demo account created! Welcome, ${registeredUser.name}!`);
          return registeredUser;
        } catch (regErr) {
          toast.error("Failed to auto-register demo account");
          throw regErr;
        }
      } else {
        toast.error(err.response?.data?.message || "Demo login failed");
        throw err;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loginRecruiter, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
