import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Create Cart Model schema here since it was missing export in inspected file or use dynamic if preferred.
// Assuming we fix the model first or import it.
// Let's first fix the cart model file to export it properly, based on previous view_file it was missing export.
// I will import it assuming I will fix it in next step, or define schema here transiently? No, better fix model.
// I will assume "Cart" is exported from ../models/cart.model.js
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity: quantity || 1 }]
        });
    } else {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }
        await cart.save();
    }

    return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
        return res.status(200).json(new ApiResponse(200, { items: [] }, "Cart is empty"));
    }

    return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    return res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

export { addToCart, getCart, removeFromCart };
