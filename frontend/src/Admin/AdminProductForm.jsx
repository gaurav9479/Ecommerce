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
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-6 font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 w-full max-w-2xl"
      >
        <div className="border-b border-gray-100 pb-6 mb-6">
           <h2 className="text-xl font-bold text-gray-800">
             Add New Listing
           </h2>
           <p className="text-sm text-gray-500 mt-1">
             Fill in the details to list your product on Glipkart
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded border border-gray-300 text-gray-900 outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
                placeholder="e.g. Samsung Galaxy S23 Ultra"
                required
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 rounded border border-gray-300 text-gray-900 outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
                placeholder="0.00"
                required
                />
            </div>

            {/* Stock */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2.5 rounded border border-gray-300 text-gray-900 outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
                placeholder="0"
                required
                />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded border border-gray-300 text-gray-900 outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors cursor-pointer"
                required
                >
                <option value="">-- Select Category --</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home</option>
                <option value="sports">Sports</option>
                <option value="books">Books</option>
                </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded border border-gray-300 text-gray-900 outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
                rows="4"
                placeholder="Describe your product features, specifications, etc."
                required
                ></textarea>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer relative">
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">{images.length > 0 ? `${images.length} file(s) selected` : "Click to upload images"}</span>
                        <span className="text-xs mt-1">SVG, PNG, JPG or GIF</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-sm font-semibold text-white shadow-md transition-all ${
                loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#2874f0] hover:bg-blue-600 hover:shadow-lg transform active:scale-95"
            }`}
            >
            {loading ? "Listing Product..." : "List Product"}
            </button>
        </div>
      </form>
    </div>
  );
}