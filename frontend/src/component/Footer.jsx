import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-darkPlum text-white py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">


        <div>
          <h2 className="text-2xl font-bold text-cherryWine mb-2">GLIPKart</h2>
          <p className="text-sm text-gray-300">
            Your one-stop shop for electronics, fashion, and more. Quality products at the best prices.
          </p>
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category/electronics">Electronics</Link></li>
            <li><Link to="/category/clothing">Clothing</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
          </ul>
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: support@glipkart.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: 123 Market Street, India</li>
          </ul>
        </div>
      </div>


      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} GLIPKart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
