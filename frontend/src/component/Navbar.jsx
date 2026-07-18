import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { useCompare } from '../Context/CompareContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Tablets', 'Watches', 'Accessories'];

const Navbar = () => {
  const { user, setUser, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { compareList } = useCompare();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }} className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="container-custom">
        <div className="flex items-center gap-4 py-3">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-xl font-black tracking-tight" style={{ color: 'var(--color-primary)' }}>
            GLIPKART
          </Link>

          {/* Search — main feature */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:flex">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field rounded-r-none flex-1 text-sm"
                style={{ borderRight: 'none', borderRadius: '6px 0 0 6px' }}
              />
              <button
                type="submit"
                className="btn-primary rounded-l-none px-5"
                style={{ borderRadius: '0 6px 6px 0' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto sm:ml-0">

            {/* Theme */}
            <Link to="/themes" className="btn-ghost hidden md:flex flex-col items-center gap-0.5 px-3 py-1.5" title="Theme">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-[10px]">Theme</span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="btn-ghost hidden md:flex flex-col items-center gap-0.5 px-3 py-1.5 relative">
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 text-[9px] font-bold flex items-center justify-center rounded-full text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="btn-ghost hidden md:flex flex-col items-center gap-0.5 px-3 py-1.5 relative">
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 text-[9px] font-bold flex items-center justify-center rounded-full text-white animate-pulseGlow" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Cart</span>
            </Link>

            {/* User */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdown(p => !p)}
                  className="btn-ghost flex flex-col items-center gap-0.5 px-3 py-1.5"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[10px] hidden md:block max-w-[60px] truncate">{user.name?.split(' ')[0]}</span>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-52 animate-fadeIn z-50 card shadow-in" style={{ boxShadow: 'var(--shadow-lg)' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{user.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-faint)' }}>{user.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { to: '/dashboard', label: 'My Profile', icon: '👤' },
                        { to: '/dashboard', label: 'My Orders', icon: '📦' },
                        { to: '/wishlist', label: `Wishlist (${wishlistItems.length})`, icon: '❤️' },
                        { to: '/compare', label: `Compare (${compareList.length})`, icon: '⚖️' },
                      ].map(item => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:surface-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                        >
                          <span>{item.icon}</span> {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '4px', paddingTop: '4px' }}>
                        <button
                          onClick={() => { handleLogout(); setUserDropdown(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors"
                          style={{ color: 'var(--color-error)' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login" className="btn-secondary text-xs py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-xs py-2 px-4">Sign Up</Link>
              </div>
            )}

            {/* Mobile icons */}
            <Link to="/cart" className="btn-ghost md:hidden relative p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 text-[8px] font-bold flex items-center justify-center rounded-full text-white" style={{ backgroundColor: 'var(--color-primary)' }}>{cartCount}</span>}
            </Link>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn-ghost md:hidden p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="sm:hidden pb-3">
          <div className="flex">
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field text-sm flex-1" style={{ borderRadius: '6px 0 0 6px', borderRight: 'none' }} />
            <button type="submit" className="btn-primary px-4" style={{ borderRadius: '0 6px 6px 0' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </form>
      </div>

      {/* Category strip */}
      <div style={{ backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }} className="hidden md:block">
        <div className="container-custom">
          <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar py-2.5">
            <Link to="/products" className="text-xs font-semibold whitespace-nowrap transition-colors" style={{ color: 'var(--color-primary)' }}>
              All Products
            </Link>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat.toLowerCase()}`}
                className="text-xs font-medium whitespace-nowrap transition-colors hover:text-white"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                {cat}
              </Link>
            ))}
            <Link to="/compare" className="text-xs font-medium whitespace-nowrap ml-auto transition-colors" style={{ color: 'var(--color-text-faint)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
            >
              ⚖️ Compare {compareList.length > 0 && `(${compareList.length})`}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fadeIn" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
          <div className="container-custom py-4 space-y-1">
            {[{ to: '/', label: 'Home' }, { to: '/products', label: 'Shop' }, { to: '/wishlist', label: 'Wishlist' }, { to: '/compare', label: 'Compare' }].map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2.5 text-sm rounded-md transition-colors" style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-2.5 text-sm rounded-md" style={{ color: 'var(--color-text-secondary)' }}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-2 py-2.5 text-sm" style={{ color: 'var(--color-error)' }}>Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="btn-secondary flex-1 text-center">Login</Link>
                <Link to="/register" className="btn-primary flex-1 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
