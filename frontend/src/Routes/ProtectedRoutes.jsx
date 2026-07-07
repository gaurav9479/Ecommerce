import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/admin/login" state={{ from: location }} replace />;
};

export const RetailerRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  return user?.role === "retailer" ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
