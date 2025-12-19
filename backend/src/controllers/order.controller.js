import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Orders } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod, totalAmount } = req.body;
    const userId = req.user._id;

    if (!shippingAddress || !paymentMethod || !totalAmount) {
        throw new ApiError(400, "All fields are required");
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const orderItems = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
    }));

    const order = await Orders.create({
        user: userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalAmount,
        paymentStatus: 'paid', // Assuming called after successful payment
        orderStatus: 'pending'
    });

    if (!order) {
        throw new ApiError(500, "Failed to create order");
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

export { createOrder };
