import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🧩 Create Product
export const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, category, imageUrl } = req.body;

    const product = await Product.create({
        name,
        price,
        description,
        category,
        imageUrl,
        retailerId: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

// 🧩 Update Product with ownership check
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    // Ownership check
    if (req.user.role !== "admin" && product.retailerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only modify your own products");
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

// 🧩 Delete Product with ownership check
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    if (req.user.role !== "admin" && product.retailerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own products");
    }

    await product.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

// 🧩 Get all products (public)
export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().populate("retailerId", "Name email");
    res.status(200).json(new ApiResponse(200, products, "All products fetched"));
});

// 🧩 Get retailer's own products
export const getMyProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ retailerId: req.user._id });
    res.status(200).json(new ApiResponse(200, products, "Your products fetched"));
});
