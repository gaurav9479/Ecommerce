// src/products/ProductList.jsx
import React, { useEffect, useState } from 'react';

import ProductCard from './ProductCard';
import axios from 'axios';

const ProductList = ({ count = 12 }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/v1/products")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setProducts(res.data.data.slice(0, count));
        } else {
          console.error("Unexpected products format:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [count]);

  return (
    <div className="p-6 bg-midnightBlack min-h-screen">
      <h2 className="text-2xl text-white mb-6 font-bold">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
          key={product._id || index}
          title={product.title}
          price={product.price}
          image={Array.isArray(product.image) ?
            product.image[0] : product.image
          }
          productId={product._id}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
