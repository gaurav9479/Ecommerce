import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🧩 Get user's wishlist
export const getWishlist = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId })
        .populate('products');

    // Create empty wishlist if doesn't exist
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    res.status(200).json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

// 🧩 Add product to wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    // Add product using model method
    await wishlist.addProduct(productId);

    const updatedWishlist = await Wishlist.findOne({ user: userId })
        .populate('products');

    res.status(200).json(new ApiResponse(200, updatedWishlist, "Product added to wishlist"));
});

// 🧩 Remove product from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        throw new ApiError(404, "Wishlist not found");
    }

    // Remove product using model method
    await wishlist.removeProduct(productId);

    const updatedWishlist = await Wishlist.findOne({ user: userId })
        .populate('products');

    res.status(200).json(new ApiResponse(200, updatedWishlist, "Product removed from wishlist"));
});

// 🧩 Toggle product in wishlist (add if not present, remove if present)
export const toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    // Toggle logic
    const isInWishlist = wishlist.products.some(id => id.toString() === productId);

    if (isInWishlist) {
        await wishlist.removeProduct(productId);
    } else {
        await wishlist.addProduct(productId);
    }

    const updatedWishlist = await Wishlist.findOne({ user: userId })
        .populate('products');

    res.status(200).json(new ApiResponse(200, {
        wishlist: updatedWishlist,
        action: isInWishlist ? 'removed' : 'added'
    }, isInWishlist ? "Product removed from wishlist" : "Product added to wishlist"));
});
