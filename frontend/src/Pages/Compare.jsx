import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../Context/CompareContext';
import StarRating from '../component/StarRating';

const Compare = () => {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    const allKeys = ['category', 'brand', 'price', 'rating', 'stock'];
    const keyLabels = {
        category: '📁 Category',
        brand: '🏷️ Brand',
        price: '💰 Price',
        rating: '⭐ Rating',
        stock: '📦 Stock',
    };

    const getDisplayValue = (product, key) => {
        if (key === 'price') return `₹${product.price?.toLocaleString()}`;
        if (key === 'rating') return `${product.rating?.toFixed(1)} / 5`;
        if (key === 'stock') return product.stock > 0 ? `${product.stock} units` : 'Out of Stock';
        if (key === 'brand') return product.brand || '—';
        return product[key] || '—';
    };

    if (compareList.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                <div className="text-8xl animate-float">⚖️</div>
                <h1 className="text-3xl font-bold gradient-text">No Products to Compare</h1>
                <p className="text-slate-400">Add products from the shop to compare them side by side.</p>
                <Link to="/products" className="btn-primary">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="flex items-center justify-between mb-10 animate-slideUp">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">Product Comparison</h1>
                        <p className="text-slate-400">Comparing {compareList.length} product{compareList.length > 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={clearCompare} className="btn-secondary">
                        🗑️ Clear All
                    </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar pb-4">
                    <table className="w-full min-w-[640px]">
                        {/* Product images row */}
                        <thead>
                            <tr>
                                <th className="w-40 text-left pb-6">
                                    <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Feature</span>
                                </th>
                                {compareList.map((product) => (
                                    <th key={product._id} className="pb-6 px-4">
                                        <div className="glass rounded-2xl p-4 relative group animate-slideUp">
                                            <button
                                                onClick={() => removeFromCompare(product._id)}
                                                className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                            >
                                                ✕
                                            </button>
                                            <img
                                                src={product.image?.[0] || 'https://placehold.co/300x300/1e293b/8b5cf6'}
                                                alt={product.title}
                                                className="w-full h-40 object-cover rounded-xl mb-3"
                                            />
                                            <Link
                                                to={`/product/${product._id}`}
                                                className="text-white font-semibold text-sm hover:gradient-text transition-all line-clamp-2"
                                            >
                                                {product.title}
                                            </Link>
                                            {product.discount > 0 && (
                                                <span className="badge badge-error mt-2">{product.discount}% OFF</span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-700/50">
                            {/* Star Rating Row */}
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-4 pr-4">
                                    <span className="text-slate-400 text-sm font-medium">⭐ Rating</span>
                                </td>
                                {compareList.map((product) => (
                                    <td key={product._id} className="py-4 px-4">
                                        <div className="flex justify-center">
                                            <StarRating rating={product.rating || 0} showCount count={product.numReviews} size="sm" />
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Other spec rows */}
                            {allKeys.filter(k => k !== 'rating').map((key) => (
                                <tr key={key} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-4 pr-4">
                                        <span className="text-slate-400 text-sm font-medium">{keyLabels[key]}</span>
                                    </td>
                                    {compareList.map((product, idx) => {
                                        const values = compareList.map(p => p[key]);
                                        const isBest = key === 'price'
                                            ? product[key] === Math.min(...values.filter(Boolean))
                                            : key === 'rating'
                                            ? product[key] === Math.max(...values.filter(Boolean))
                                            : false;

                                        return (
                                            <td key={product._id} className="py-4 px-4 text-center">
                                                <span className={`text-sm font-semibold ${isBest ? 'gradient-text' : 'text-white'}`}>
                                                    {getDisplayValue(product, key)}
                                                </span>
                                                {isBest && (key === 'price' || key === 'rating') && (
                                                    <div className="text-xs text-green-400 mt-1">
                                                        {key === 'price' ? '🏆 Lowest Price' : '🏆 Best Rated'}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}

                            {/* Add to Cart row */}
                            <tr>
                                <td className="py-6" />
                                {compareList.map((product) => (
                                    <td key={product._id} className="py-6 px-4">
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="btn-primary w-full text-center block text-sm"
                                        >
                                            View Product
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Compare;
