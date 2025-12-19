// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './component/Home'

import Applayout from './component/Applayout/Applayout';
import Login from './Pages/Login'
import Register from './Pages/Register';
import AdminLayout from './Admin/adminlayout';
import AdminDashboard from './Admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminRegister from './Admin/AdminRegister';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Applayout />,
    children: [
      // ... (existing routes)
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
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'payment',
        element: <Payment />
      },

    ],

  },
  {
    path: '/admin',
    element: <AdminLayout />, // Admin layout with admin navbar
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
);

function App() {
  return <RouterProvider router={router} />
}

export default App;
