import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from '../component/StarRating';
import LoadingSkeleton from '../component/LoadingSkeleton';
import AddReview from '../component/Products/AddReview';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
       toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleWishlistToggle = async () => {
    setIsWishlistLoading(true);
    try {
      await toggleWishlist(id);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.image || [];

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 mb-16">

          <div className="space-y-4">
            <div className="glass rounded-2xl overflow-hidden p-4">
              <img
                src={images[selectedImage] || 'https://placehold.co/600x600/1e293b/8b5cf6'}
                alt={product.title}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`glass rounded-lg overflow-hidden p-2 transition-all ${
                      selectedImage === index ? 'ring-2 ring-purple-500' : 'hover:ring-2 hover:ring-purple-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-20 object-cover rounded" />
                  </button>
                ))}
              </div>
            )}
          </div>


          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">{product.title}</h1>
              {product.rating > 0 && (
                <StarRating rating={product.rating} showCount count={product.numReviews} size="lg" />
              )}
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold gradient-text">₹{product.price?.toLocaleString()}</span>
              {product.stock <= 10 && product.stock > 0 && (
                <span className="badge badge-warning">Only {product.stock} left!</span>
              )}
            </div>

            <p className="text-slate-300 text-lg leading-relaxed">{product.description}</p>

            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-white font-semibold">Quantity:</label>
                  <div className="flex items-center gap-3 glass rounded-lg p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleAddToCart} className="btn-primary flex-1">
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className={`btn-outline p-3 ${isInWishlist(id) ? 'text-pink-500 border-pink-500' : 'text-slate-400 border-slate-700'}`}
                  >
                    <svg className={`w-6 h-6 ${isInWishlist(id) ? 'fill-pink-500' : 'fill-none'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="badge badge-error text-lg py-3 px-6">Out of Stock</div>
            )}

            <div className="glass rounded-xl p-6 space-y-3">
              {product.owner && (
                 <div className="flex items-center gap-3 text-white border-b border-slate-700 pb-3 mb-3">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center font-bold text-lg">
                      {product.owner.name?.[0] || 'S'}
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Sold by</p>
                      <p className="font-semibold text-lg">{product.owner.name}</p>
                    </div>
                 </div>
              )}

              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
               </svg>
                <span>Free Shipping on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>100% Authentic Products</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>7 Days Return Policy</span>
              </div>
            </div>
          </div>
        </div>


        <div className="glass rounded-2xl p-8">
          <div className="flex gap-4 border-b border-slate-700 mb-6">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed">{product.description}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Category</span>
                  <span className="text-white font-semibold capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Stock</span>
                  <span className="text-white font-semibold">{product.stock} units</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Rating</span>
                  <span className="text-white font-semibold">{product.rating.toFixed(1)}★</span>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <AddReview productId={id} onReviewAdded={fetchProduct} />
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review._id} className="glass rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                          {review.user?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-white">{review.user?.name || 'Anonymous'}</span>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <p className="text-slate-300 mb-2">{review.comment}</p>
                          <span className="text-sm text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
