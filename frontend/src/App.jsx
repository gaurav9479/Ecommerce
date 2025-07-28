// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './component/Home'

import Applayout from './component/Applayout/applayout'
import Login from './Pages/Login'

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
      }
    ]
  },
  
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
