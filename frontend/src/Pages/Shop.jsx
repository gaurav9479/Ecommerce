import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../component/Products/ProductCard';
import LoadingSkeleton from '../component/LoadingSkeleton';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: Number(searchParams.get('page')) || 1
  });

  const categories = React.useMemo(() => ['smartphones', 'laptops', 'headphones', 'cameras', 'tablets', 'accessories', 'watches'], []);
  
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating', label: 'Highest Rated' }
  ];

  // Memoize grouped products to avoid re-filtering every render
  const groupedProducts = React.useMemo(() => {
    if (filters.category || filters.search) return null;
    
    const groups = {};
    categories.forEach(cat => {
      groups[cat] = products.filter(p => p.category === cat);
    });
    
    const others = products.filter(p => !categories.includes(p.category));
    if (others.length > 0) groups['others'] = others;
    
    return groups;
  }, [products, filters.category, filters.search, categories]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Increase limit for row view to show variety
      if (!filters.search && !filters.category) {
        params.append('limit', '50');
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/products?${params.toString()}`);
      setProducts(response.data.data.products || []);
      setPagination(response.data.data.pagination || {});
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Update URL
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sort: '-createdAt',
      page: 1
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="glass-strong border-b border-slate-700">
        <div className="container-custom py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="animate-slideUp">
            <h1 className="text-4xl font-bold gradient-text mb-2">Shop All Products</h1>
            <p className="text-slate-400">Discover our complete collection</p>
          </div>
          
          <div className="w-full max-w-md animate-slideInRight">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for perfection..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border-slate-700/50 group-hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-purple-500/5"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Category</label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() => handleFilterChange('category', cat)}
                        className="w-4 h-4 text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-slate-400 group-hover:text-white transition-colors capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleFilterChange('category', '')}
                      className="w-4 h-4 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-slate-400 group-hover:text-white transition-colors">
                      All Categories
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Minimum Rating</label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.minRating === String(rating)}
                        onChange={() => handleFilterChange('minRating', String(rating))}
                        className="w-4 h-4 text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-slate-400 group-hover:text-white transition-colors flex items-center gap-1">
                        {rating}★ & above
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-slate-400">
                {pagination.total ? `${pagination.total} products found` : 'Loading...'}
              </p>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field w-auto text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid-auto-fit">
                <LoadingSkeleton variant="product" count={12} />
              </div>
            ) : products.length > 0 ? (
              <>
                {filters.category || filters.search ? (
                  /* Grid View for Filtered/Searched Results */
                  <div className="grid-auto-fit">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  /* Category Rows View for General Shop */
                  <div className="space-y-16">
                    {categories.map((cat) => {
                      const categoryProducts = groupedProducts?.[cat] || [];
                      if (categoryProducts.length === 0) return null;
                      
                      return (
                        <div key={cat} className="animate-slideUp">
                          <div className="flex items-center justify-between mb-6 group cursor-pointer" onClick={() => handleFilterChange('category', cat)}>
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-8 gradient-bg rounded-full shadow-glow" />
                              <h2 className="text-2xl font-bold text-white capitalize tracking-tight group-hover:gradient-text transition-all duration-300">
                                {cat}
                              </h2>
                            </div>
                            <span className="text-purple-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                              View All →
                            </span>
                          </div>
                          
                          <div className="flex overflow-x-auto gap-6 pb-6 custom-scrollbar scroll-smooth snap-x">
                            {categoryProducts.map((product) => (
                              <div key={product._id} className="min-w-[280px] w-[280px] flex-shrink-0 snap-start">
                                <ProductCard product={product} />
                              </div>
                            ))}
                            {/* Empty space at the end */}
                            <div className="min-w-[1px] w-1" />
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Other Products not in main categories */}
                    {groupedProducts?.others?.length > 0 && (
                      <div className="animate-slideUp">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                          <div className="w-1.5 h-8 bg-slate-700 rounded-full" />
                          More Discoveries
                        </h2>
                        <div className="flex overflow-x-auto gap-6 pb-6 custom-scrollbar snap-x">
                          {groupedProducts.others.map((product) => (
                            <div key={product._id} className="min-w-[280px] w-[280px] flex-shrink-0 snap-start">
                              <ProductCard product={product} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <button
                      onClick={() => handleFilterChange('page', filters.page - 1)}
                      disabled={filters.page <= 1}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleFilterChange('page', i + 1)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            filters.page === i + 1
                              ? 'gradient-bg text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleFilterChange('page', filters.page + 1)}
                      disabled={filters.page >= pagination.pages}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-now-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
