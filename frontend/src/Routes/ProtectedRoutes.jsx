import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export const RetailerRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user?.role === "retailer" ? <Outlet /> : <Navigate to="/" />;
};
