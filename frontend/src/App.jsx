import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Applayout from './component/Applayout/Applayout';
import Home from './component/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Shop from './Pages/Shop';
import ProductDetail from './Pages/ProductDetail';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';
import Wishlist from './Pages/Wishlist';
import CheckoutDetails from './Pages/CheckoutDetails';
import ThemePage from './Pages/ThemePage';
import Compare from './Pages/Compare';
import OrderTracking from './Pages/OrderTracking';
import NotFound from './Pages/NotFound';
import AdminLayout from './Admin/adminlayout';
import AdminDashboard from './Admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminRegister from './Admin/AdminRegister';
import AdminProductForm from './Admin/AdminProductForm';
import UserDashboard from './Pages/UserDashboard';

import { AdminRoute, PrivateRoute } from './Routes/ProtectedRoutes';
import { CompareProvider } from './Context/CompareContext';
import { NotificationProvider } from './Context/NotificationContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Applayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'products',
        element: <Shop />
      },
      {
        path: 'product/:id',
        element: <ProductDetail />
      },
      {
        path: 'compare',
        element: <Compare />
      },
      {
        path: 'themes',
        element: <ThemePage />
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'cart',
            element: <Cart />
          },
          {
            path: 'payment',
            element: <Payment />
          },
          {
            path: 'wishlist',
            element: <Wishlist />
          },
          {
            path: 'checkout-details',
            element: <CheckoutDetails />
          },
          {
            path: 'dashboard',
            element: <UserDashboard />
          },
          {
            path: 'order-tracking/:orderId',
            element: <OrderTracking />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'login',
        element: <AdminLogin />
      },
      {
        path: 'register',
        element: <AdminRegister />
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: 'dashboard',
            element: <AdminDashboard />
          },
          {
            path: 'products',
            element: <AdminProductForm />
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <NotificationProvider>
      <CompareProvider>
        <RouterProvider router={router} />
      </CompareProvider>
    </NotificationProvider>
  );
}

export default App;
