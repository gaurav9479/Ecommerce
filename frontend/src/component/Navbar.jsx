// src/components/Navbar.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { toast } from 'react-hot-toast'

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {

    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    navigate('/login');
  }

  return (
    <nav className="bg-midnightBlack text-white px-6 py-3 shadow-md flex justify-between items-center">
      

      <Link to="/" className="text-2xl font-bold text-crimsonPlum">GLIPKart</Link>
      

      <div className="flex items-center gap-6 text-sm">
        <Link to="/category/electronics" className="hover:text-cherryWine">Electronics</Link>
        <Link to="/category/clothing" className="hover:text-cherryWine">Clothing</Link>
        <Link to="/orders" className="hover:text-cherryWine">Orders</Link>
      </div>


      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="px-3 py-1 rounded-md border border-deepVoid bg-darkPlum text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cherryWine"
        />

        {user ? (
          <>
            <span className="text-sm text-gray-300">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-cherryWine text-white hover:bg-crimsonPlum transition"
          >
            Login
          </Link>
        )}
      </div>

    </nav>
  )
}

export default Navbar
