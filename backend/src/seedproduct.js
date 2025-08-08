// // backend/src/seedproduct.js
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import fetch from "node-fetch";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import { Product } from "./models/product.model.js";
// import { v2 as cloudinary } from "cloudinary";
// import axios from "axios";

// dotenv.config();

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function downloadImage(url, filepath) {
//   const response = await axios({ url, responseType: "stream" });
//   return new Promise((resolve, reject) => {
//     const writer = fs.createWriteStream(filepath);
//     response.data.pipe(writer);
//     writer.on("finish", resolve);
//     writer.on("error", reject);
//   });
// }

// async function uploadOnCloudinary(localFilePath) {
//   try {
//     const result = await cloudinary.uploader.upload(localFilePath, {
//       folder: "ecommerce-products"
//     });
//     fs.unlinkSync(localFilePath);
//     return result.secure_url;
//   } catch (error) {
//     console.error("❌ Cloudinary Upload Error:", error);
//     return null;
//   }
// }

// async function seedProducts() {
//   try {
//     await mongoose.connect("mongodb+srv://gauravshivmurat2:glipkart@dukan.ynw2o5h.mongodb.net/Ecommerce");
//     console.log("✅ MongoDB connected");

//     const res = await fetch("https://fakestoreapi.com/products");
//     const products = await res.json();

//     const seededProducts = [];

//     for (const product of products) {
//       const tempImagePath = path.join(__dirname, "temp.jpg");
//       await downloadImage(product.image, tempImagePath);
//       const cloudinaryUrl = await uploadOnCloudinary(tempImagePath);

//       const newProduct = new Product({
//         title: product.title,
//         price: product.price,
//         description: product.description,
//         category: product.category,
//         image: cloudinaryUrl
//       });

//       seededProducts.push(await newProduct.save());
//     }

//     console.log(`✅ Seeded ${seededProducts.length} products`);
//     process.exit();
//   } catch (error) {
//     console.error("❌ Error seeding products:", error);
//     process.exit(1);
//   }
// }

// seedProducts();
