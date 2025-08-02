import React, { useState } from 'react';
import axios from 'axios';

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);

    images.forEach((image) => data.append('images', image));

    await axios.post("http://localhost:9000/api/admin/add-product", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert('Product uploaded successfully!');
  } catch (err) {
    console.error(err);
    alert('Upload failed');
  }
  };




  

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Product Name"
          onChange={handleChange}
          value={formData.name}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          value={formData.description}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Product Price"
          onChange={handleChange}
          value={formData.price}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
