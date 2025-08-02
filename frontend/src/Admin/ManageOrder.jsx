import React, { useState } from 'react';
import axios from 'axios';

const AdminAddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    size: [],
    
    imageUrls: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [preview, setPreview] = useState(null);

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "size") {
      const sizes = value.split(',').map(size => size.trim());
      setProduct({ ...product, size: sizes });
    } else {
      setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
    }
  };

  // Handle Cloudinary Upload
  const handleImageUpload = async () => {
    const uploadedUrls = [];
    const formData = new FormData();
    for (const file of imageFiles) {
      formData.append('file', file);
      formData.append('upload_preset', 'your_preset_here'); // Replace with Cloudinary upload preset

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Replace with your Cloudinary name
        formData
      );
      uploadedUrls.push(response.data.secure_url);
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urls = await handleImageUpload();
    const fullProduct = { ...product, Image: urls };
    setPreview(fullProduct);
    // You can then submit fullProduct to your backend
    // await axios.post('/api/admin/products', fullProduct);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Product Name" onChange={handleChange} className="input" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="input" />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} className="input" />

        {/* Category Dropdown */}
        <select name="category" onChange={handleChange} className="input">
          <option value="">Select Category</option>
          <option value="id1">Electronics</option>
          <option value="id2">Clothing</option>
          <option value="id3">Footwear</option>
        </select>

        <input name="subCategory" type="text" placeholder="Subcategory" onChange={handleChange} className="input" />
        <input name="size" type="text" placeholder="Sizes (comma separated)" onChange={handleChange} className="input" />

        

        {/* Image Upload */}
        <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles([...e.target.files])} className="input" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Preview</button>
      </form>

      {/* Product Preview */}
      {preview && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold">Preview:</h3>
          <p><strong>Name:</strong> {preview.name}</p>
          <p><strong>Desc:</strong> {preview.description}</p>
          <p><strong>Price:</strong> ₹{preview.price}</p>
          <p><strong>Sizes:</strong> {preview.size.join(', ')}</p>
         
          <div className="flex gap-2 mt-2">
            {preview.Image?.map((url, i) => (
              <img key={i} src={url} alt="preview" className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddProduct;
