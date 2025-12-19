import React from 'react';
import axios from 'axios';

const ProductCard = ({ title, price, image, productId }) => {

  const addToCart = async () => {
    try {
      await axios.post('/api/v1/cart/add', 
        { productId, quantity: 1 }, 
        { withCredentials: true }
      );
      alert("Added to cart");
    } catch (error) {
      console.error("Error adding to cart", error);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="bg-darkPlum rounded-lg p-4 shadow text-white flex flex-col justify-between h-full">
      <div>
        <div className="w-full h-32 bg-cherryWine rounded mb-3 flex items-center justify-center overflow-hidden">
          {image ? <img src={image} alt={title} className="object-cover h-full w-full rounded" /> : <span>No Image</span>}
        </div>
        <h3 className="text-base font-semibold truncat mb-1">{title}</h3>
        <p className="text-sm text-gray-300 mb-2">₹{price}</p>
      </div>
      <button 
        onClick={addToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded mt-2 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
