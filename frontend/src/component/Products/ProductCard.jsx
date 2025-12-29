import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from '../StarRating';

const ProductCard = ({ product, onWishlistToggle }) => {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/wishlist/toggle`,
        { productId: product._id },
        { withCredentials: true }
      );
      
      setIsInWishlist(response.data.data.action === 'added');
      toast.success(response.data.message);
      
      if (onWishlistToggle) {
        onWishlistToggle(product._id);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to add to wishlist');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update wishlist');
      }
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/cart/add`,
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );
      toast.success('Added to cart!');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to add to cart');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      }
    }
  };

  const imageUrl = product.image && product.image.length > 0 
    ? product.image[0] 
    : 'https://placehold.co/400x400/1e293b/8b5cf6?text=No+Image';

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="card-interactive group overflow-hidden">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg mb-4 bg-slate-800">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x400/1e293b/8b5cf6?text=No+Image';
            }}
          />
          
          {/* Wishlist Heart */}
          <button
            onClick={handleWishlistClick}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2 rounded-full glass-strong hover:scale-110 transition-all duration-300 ${isWishlistLoading ? 'opacity-50' : ''}`}
          >
            <svg
              className={`w-5 h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'fill-none text-white'}`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Stock Badge */}
          {product.stock <= 0 && (
            <div className="absolute top-3 left-3 badge badge-error">
              Out of Stock
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-3 left-3 badge gradient-bg text-white">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:gradient-text transition-all">
            {product.title}
          </h3>
          
          {/* Rating */}
          {product.rating > 0 && (
            <StarRating rating={product.rating} showCount count={product.numReviews} size="sm" />
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold gradient-text">
              ₹{product.price?.toLocaleString()}
            </span>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                product.stock > 0 
                  ? 'gradient-bg text-white hover:scale-110 hover:shadow-xl' 
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              title={product.stock > 0 ? 'Add to cart' : 'Out of stock'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
          
          {/* Stock indicator */}
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-amber-400">Only {product.stock} left!</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
