import productModel from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
     console.log("Files received:", req.files);

    const images = [];

    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path);
      console.log("Cloudinary response:", uploaded);
      if (uploaded?.url) images.push(uploaded.url);
    }

    const newProduct = await productModel.create({
      name,
      description,
      price,
      Image: images,
    });

    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};
