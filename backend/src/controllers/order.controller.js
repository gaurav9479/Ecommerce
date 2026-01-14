import { Orders as Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🧩 Create order after successful payment
export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentIntentId, totalAmount, timeSlot, location } = req.body;
    const userId = req.user._id;

    if (req.user.role === "admin") {
        throw new ApiError(403, "Admins cannot make purchases.");
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    // Validate stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
        const product = await Product.findById(item.product);

        if (!product) {
            throw new ApiError(404, `Product ${item.product._id} not found`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.title}`);
        }

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
        });

        // Reduce stock
        product.stock -= item.quantity;
        await product.save();
    }

    // Create order
    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentIntentId,
        timeSlot,
        location,
        status: 'Processing'
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
        .populate('items.product')
        .populate('user', 'Name email');

    res.status(201).json(new ApiResponse(201, populatedOrder, "Order created successfully"));
});

// 🧩 Get user's order history
export const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
        .populate('items.product')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await Order.countDocuments({ user: userId });

    res.status(200).json(new ApiResponse(200, {
        orders,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    }, "Orders fetched successfully"));
});

// 🧩 Get order by ID
export const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId)
        .populate('items.product')
        .populate('user', 'Name email');

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Check if user is admin or order owner
    if (order.user._id.toString() !== userId.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You can only view your own orders");
    }

    res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// 🧩 Update order status (Admin only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.status = status;
    if (status === 'Delivered') {
        order.deliveredAt = new Date();
    }
    await order.save();

    const updatedOrder = await Order.findById(orderId)
        .populate('items.product')
        .populate('user', 'Name email');

    res.status(200).json(new ApiResponse(200, updatedOrder, "Order status updated successfully"));
});

// 🧩 Get all orders (Admin only)
export const getAllOrders = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
        .populate('items.product')
        .populate('user', 'Name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await Order.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, {
        orders,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    }, "Orders fetched successfully"));
});
