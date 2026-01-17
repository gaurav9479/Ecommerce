import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../Context/WishlistContext';
import { useCart } from '../../Context/CartContext';
import StarRating from '../StarRating';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistLoading(true);
    try {
      await toggleWishlist(product._id);
      // Context handles state update
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product._id, 1);
      navigate('/cart'); // Navigate to cart first to see summary or straight to payment
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const imageUrl = product.image && product.image.length > 0 
    ? product.image[0] 
    : 'https://placehold.co/400x400/1e293b/8b5cf6?text=No+Image';

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="card-interactive group overflow-hidden will-change-transform">

        <div className="relative overflow-hidden rounded-lg mb-4 bg-slate-800">
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x400/1e293b/8b5cf6?text=No+Image';
            }}
          />
          

          <button
            onClick={handleWishlistClick}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2 rounded-full glass-strong hover:scale-110 transition-all duration-300 ${isWishlistLoading ? 'opacity-50' : ''}`}
          >
            <svg
              className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-pink-500 text-pink-500' : 'fill-none text-white'}`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>


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


        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:gradient-text transition-all">
            {product.title}
          </h3>
          

          {product.rating > 0 && (
            <StarRating rating={product.rating} showCount count={product.numReviews} size="sm" />
          )}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold gradient-text">
                ₹{product.price?.toLocaleString()}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  product.stock > 0 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="Add to cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className={`w-full py-2.5 rounded-lg font-bold transition-all duration-300 ${
                product.stock > 0 
                  ? 'gradient-bg text-white hover:scale-[1.02] shadow-lg shadow-purple-500/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Buy Now
            </button>
          </div>
          

          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-amber-400">Only {product.stock} left!</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
