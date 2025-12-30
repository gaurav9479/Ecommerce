import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import LoadingSkeleton from '../LoadingSkeleton';

const ProductList = ({ count = 12, featured = false, title = "Our Products" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const endpoint = featured 
          ? `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/products/featured?limit=${count}`
          : `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/products?limit=${count}`;
        
        const response = await axios.get(endpoint);
        
        // Handle both direct array and paginated response
        const productData = response.data.data.products || response.data.data;
        setProducts(Array.isArray(productData) ? productData : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [count, featured]);

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <h2 className="text-3xl font-bold gradient-text mb-8">{title}</h2>
        <div className="grid-auto-fit">
          <LoadingSkeleton variant="product" count={count} />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container-custom section-padding text-center">
        <h2 className="text-3xl font-bold gradient-text mb-8">{title}</h2>
        <p className="text-slate-400 text-lg">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      <h2 className="text-3xl font-bold gradient-text mb-8 animate-slideUp">{title}</h2>
      <div className="grid-auto-fit">
        {products.map((product, index) => (
          <div key={product._id || index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
