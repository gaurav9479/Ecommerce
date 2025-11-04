import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute, AdminRoute, RetailerRoute } from "./Routes/ProtectedRoutes";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./component/Home";
import AdminDashboard from "./Admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<div>User Dashboard</div>} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        <Route element={<RetailerRoute />}>
          <Route path="/retailer/*" element={<div>Retailer Panel</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
