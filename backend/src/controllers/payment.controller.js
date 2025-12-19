import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Stripe from "stripe";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    // Calculate total amount
    let totalAmount = 0;
    cart.items.forEach(item => {
        if (item.product && item.product.price) {
            totalAmount += item.product.price * item.quantity;
        }
    });

    if (totalAmount === 0) {
        throw new ApiError(400, "Total amount is 0");
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Amount in cents
        currency: "usd",
        metadata: { userId: userId.toString() },
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return res.status(200).json(new ApiResponse(200, {
        clientSecret: paymentIntent.client_secret,
        amount: totalAmount
    }, "Payment Intent created"));
});

export { createPaymentIntent };
