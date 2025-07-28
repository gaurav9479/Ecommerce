// src/products/ProductCard.jsx
import React from 'react';

const ProductCard = ({ title, price, image }) => {
  return (
    <div className="bg-darkPlum rounded-lg p-4 shadow text-white">
      <div className="w-full h-32 bg-cherryWine rounded mb-3 flex items-center justify-center">
        {image ? <img src={image} alt={title} className="object-cover h-full w-full rounded" /> : <span>No Image</span>}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-gray-300">₹{price}</p>
    </div>
  );
};

export default ProductCard;
