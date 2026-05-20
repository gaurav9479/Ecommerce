import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../Context/WishlistContext';
import { useCart } from '../../Context/CartContext';
import { useCompare } from '../../Context/CompareContext';
import StarRating from '../StarRating';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToCompare, isInCompare } = useCompare();
  const [showQuickView, setShowQuickView] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try { await toggleWishlist(product._id); }
    catch (err) { if (err.response?.status === 401) navigate('/login'); }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try { await addToCart(product._id, 1); }
    catch (err) { if (err.response?.status === 401) navigate('/login'); }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try { await addToCart(product._id, 1); navigate('/cart'); }
    catch (err) { if (err.response?.status === 401) navigate('/login'); }
  };

  const handleCompare = (e) => {
    e.preventDefault(); e.stopPropagation();
    addToCompare(product);
  };

  const imageUrl = !imgError && product.image?.length > 0
    ? product.image[0]
    : 'https://placehold.co/400x400/1f2937/6366f1?text=No+Image';

  const discountedPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : null;

  const inWishlist = isInWishlist(product._id);

  return (
    <>
      <Link to={`/product/${product._id}`} className="block group">
        <div className="card-product flex flex-col h-full">

          {/* Image container */}
          <div className="relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <img
              src={imageUrl}
              alt={product.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <svg
                className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'}`}
                stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
              {product.discount > 0 && (
                <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: '#dc2626' }}>
                  {product.discount}% OFF
                </span>
              )}
              {product.flashDeal?.isActive && (
                <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: '#ea580c' }}>
                  🔥 FLASH
                </span>
              )}
              {product.stock <= 0 && (
                <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-error)' }}>
                  SOLD OUT
                </span>
              )}
            </div>

            {/* Hover actions */}
            <div className="absolute bottom-0 inset-x-0 flex gap-1 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200" style={{ backgroundColor: 'rgba(17,24,39,0.9)' }}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickView(true); }}
                className="flex-1 text-xs font-semibold py-1.5 rounded transition-colors text-white hover:opacity-80"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              >
                Quick View
              </button>
              <button
                onClick={handleCompare}
                className="flex-1 text-xs font-semibold py-1.5 rounded transition-colors"
                style={{
                  backgroundColor: isInCompare(product._id) ? 'var(--color-primary)' : 'var(--color-surface-2)',
                  color: 'white'
                }}
              >
                {isInCompare(product._id) ? '✓ Added' : '+ Compare'}
              </button>
            </div>
          </div>

          {/* Product info */}
          <div className="p-3 flex flex-col gap-2 flex-1">
            {product.brand && (
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                {product.brand}
              </p>
            )}

            <h3 className="text-sm font-medium line-clamp-2 leading-snug" style={{ color: 'var(--color-text)' }}>
              {product.title}
            </h3>

            {product.rating > 0 && (
              <StarRating rating={product.rating} showCount count={product.numReviews} size="sm" />
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-auto pt-1">
              <span className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                ₹{(discountedPrice || product.price)?.toLocaleString()}
              </span>
              {discountedPrice && (
                <span className="text-xs line-through" style={{ color: 'var(--color-text-faint)' }}>
                  ₹{product.price?.toLocaleString()}
                </span>
              )}
              {discountedPrice && (
                <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
                  {product.discount}% off
                </span>
              )}
            </div>

            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-[10px] font-medium" style={{ color: 'var(--color-warning)' }}>
                Only {product.stock} left
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 btn-outline text-xs py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 btn-primary text-xs py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Link>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default ProductCard;
