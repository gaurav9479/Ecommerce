// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './component/Home'

import Applayout from './component/Applayout/Applayout';
import Login from './Pages/Login'
import Register from './Pages/Register';
import AdminDashboard from './Pages/AdminDashboard';

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
        path:'register',
        element:<Register/>

      },
      
    ],
    
  },
  {
    path:'/admin/dashboard',
    element:<AdminDashboard/>,
    children: [
      { index: true, element: <AdminDashboard /> }
    ]
  }
  
]
);

function App() {
  return <RouterProvider router={router} />
}

export default App;
