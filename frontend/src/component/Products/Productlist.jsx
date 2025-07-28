// src/products/ProductList.jsx
import React from 'react';
import { generateSampleProducts } from './product';
import ProductCard from './ProductCard';

const ProductList = ({ count = 12 }) => {
  const products = generateSampleProducts(count); // dynamic count

  return (
    <div className="p-6 bg-midnightBlack min-h-screen">
      <h2 className="text-2xl text-white mb-6 font-bold">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
