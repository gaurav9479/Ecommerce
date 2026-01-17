import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/users/logout`, {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-slate-700">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">

          <Link to="/" className="text-2xl md:text-3xl font-bold gradient-text hover:scale-105 transition-transform">
            GLIPKART
          </Link>


          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="text-slate-300 hover:text-white transition-colors font-medium">
              Shop
            </Link>
            {user && (
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors font-medium">
                Dashboard
              </Link>
            )}
          </div>


          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary-from)] hover:text-[var(--color-primary-to)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>


          <div className="flex items-center gap-4">

            <Link to="/themes" className="relative p-2 hover:scale-110 transition-transform" title="Change Theme">
              <svg className="w-6 h-6 text-white hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </Link>


            <Link to="/wishlist" className="relative p-2 hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>


            <Link to="/cart" className="relative p-2 hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs flex items-center justify-center rounded-full animate-pulseGlow">
                  {cartCount}
                </span>
              )}
            </Link>


            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="glass rounded-lg px-4 py-2">
                  <span className="text-sm text-slate-300">Hi, <span className="font-semibold text-white">{user.name}</span></span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
                <Link to="/admin/login" className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center">
                  Sell on GLIPKART
                </Link>
              </div>
            )}


            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>


        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-slate-700 animate-fadeIn">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full"
              />
            </form>
            <Link to="/" className="block text-slate-300 hover:text-white py-2">Home</Link>
            <Link to="/products" className="block text-slate-300 hover:text-white py-2">Shop</Link>
            <Link to="/wishlist" className="block text-slate-300 hover:text-white py-2">Wishlist</Link>
            {user && (
              <Link to="/dashboard" className="block text-slate-300 hover:text-white py-2">Dashboard</Link>
            )}
            {user ? (
              <>
                <div className="text-white py-2">Hi, {user.name}</div>
                <button onClick={handleLogout} className="btn-secondary w-full">
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="btn-secondary w-full block text-center">Login</Link>
                <Link to="/register" className="btn-primary w-full block text-center">Sign Up</Link>
                <Link to="/admin/login" className="text-yellow-400 block text-center py-2">Sell on GLIPKART →</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
