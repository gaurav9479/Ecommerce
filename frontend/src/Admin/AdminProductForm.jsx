import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AdminProductForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!images.length) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);

    images.forEach((img) => {
      formData.append("images", img);
    });

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/admin/ADD-products`, 
        formData, 
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true 
        }
      );
      toast.success("Product added successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deepVoid flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-midnightBlack shadow-lg rounded-xl p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-crimsonPlum mb-6">
          Add New Product
        </h2>

        {/* Title */}
        <label className="block text-white mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded-md bg-darkPlum text-white outline-none mb-4"
          required
        />

        {/* Price */}
        <label className="block text-white mb-2">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 rounded-md bg-darkPlum text-white outline-none mb-4"
          required
        />

        {/* Stock */}
        <label className="block text-white mb-2">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full p-2 rounded-md bg-darkPlum text-white outline-none mb-4"
          required
        />

        {/* Description */}
        <label className="block text-white mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded-md bg-darkPlum text-white outline-none mb-4"
          rows="3"
          required
        ></textarea>

        {/* Category Dropdown */}
        <label className="block text-white mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 rounded-md bg-darkPlum text-white outline-none mb-4"
          required
        >
          <option value="">-- Select Category --</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home</option>
          <option value="sports">Sports</option>
          <option value="books">Books</option>
        </select>

        {/* Image Upload */}
        <label className="block text-white mb-2">Product Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="w-full text-white mb-4"
          accept="image/*"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-md font-semibold transition ${
            loading 
              ? "bg-gray-600 cursor-not-allowed" 
              : "bg-cherryWine hover:bg-crimsonPlum text-white"
          }`}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}