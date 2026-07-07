import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishlistContext';
import StarRating from '../StarRating';
import toast from 'react-hot-toast';

const QuickViewModal = ({ product, onClose }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        const handler = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
    }, [onClose]);

    if (!product) return null;

    const discountedPrice = product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : null;

    const handleAddToCart = async () => {
        try { await addToCart(product._id, 1); onClose(); }
        catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error('Please login to add to cart');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>

            <div className="absolute inset-0 bg-black/60 animate-fadeIn" />


            <div className="relative max-w-xl w-full rounded-xl overflow-hidden animate-bounceIn z-10 shadow-2xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>

                <button onClick={onClose} className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors"
                    style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-error)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >✕</button>

                <div className="grid sm:grid-cols-2">

                    <div className="relative" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        <img
                            src={product.image?.[0] || 'https://placehold.co/400x400/1f2937/6366f1'}
                            alt={product.title}
                            className="w-full h-56 sm:h-full object-cover"
                        />
                        {product.discount > 0 && (
                            <span className="absolute top-3 left-3 text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: '#dc2626' }}>
                                {product.discount}% OFF
                            </span>
                        )}
                    </div>


                    <div className="p-5 space-y-3">
                        {product.brand && <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>{product.brand}</p>}
                        <h2 className="text-base font-bold leading-snug" style={{ color: 'var(--color-text)' }}>{product.title}</h2>

                        {product.rating > 0 && <StarRating rating={product.rating} showCount count={product.numReviews} size="sm" />}


                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black" style={{ color: 'var(--color-text)' }}>
                                ₹{(discountedPrice || product.price)?.toLocaleString()}
                            </span>
                            {discountedPrice && (
                                <>
                                    <span className="text-sm line-through" style={{ color: 'var(--color-text-faint)' }}>₹{product.price?.toLocaleString()}</span>
                                    <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>{product.discount}% off</span>
                                </>
                            )}
                        </div>

                        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                            {product.description?.slice(0, 120)}{product.description?.length > 120 ? '...' : ''}
                        </p>


                        <div>
                            {product.stock > 0
                                ? <span className="badge badge-success">In Stock</span>
                                : <span className="badge badge-error">Out of Stock</span>}
                        </div>


                        <div className="space-y-2 pt-1">
                            {product.stock > 0 && (
                                <button onClick={handleAddToCart} className="btn-primary w-full text-sm">Add to Cart</button>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={async () => {
                                        try {
                                            await toggleWishlist(product._id);
                                        } catch (error) {
                                            if (error.response?.status === 401) {
                                                navigate('/login');
                                            } else {
                                                toast.error('Please login to manage wishlist');
                                            }
                                        }
                                    }}
                                    className="flex-1 btn-secondary text-xs"
                                >
                                    {isInWishlist(product._id) ? '❤️ Remove' : '🤍 Wishlist'}
                                </button>
                                <Link to={`/product/${product._id}`} onClick={onClose} className="flex-1 btn-outline text-xs text-center">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
