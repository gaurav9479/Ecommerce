// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './component/Home'

import Applayout from './component/Applayout/Applayout';
import Login from './Pages/Login'
import Register from './Pages/Register';

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
      path: '/login',
      element: <Login />
      },
      {
        path:'/register',
        element:<Register/>

      }
    ]
  },
  
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
