import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Stripe from "stripe";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    console.log("Creating payment intent for user:", userId);
    if (!cart) {
        console.error("Cart not found for user:", userId);
        throw new ApiError(404, "Cart not found");
    }

    console.log("Cart items count:", cart.items.length);
    console.log("Cart items raw:", JSON.stringify(cart.items, null, 2));

    if (cart.items.length === 0) {
        console.error("Cart is empty for user:", userId);
        throw new ApiError(400, "Cart is empty");
    }

    // Calculate total amount
    let totalAmount = 0;
    cart.items.forEach((item, index) => {
        console.log(`Item ${index}:`, item.product ? `Product present (Price: ${item.product.price})` : "Product NULL");
        if (item.product && item.product.price) {
            totalAmount += item.product.price * item.quantity;
        }
    });

    console.log("Total amount calculated:", totalAmount);

    if (totalAmount === 0) {
        console.error("Total amount is 0 for cart items:", cart.items);
        throw new ApiError(400, "Total amount is 0");
    }

    // Create PaymentIntent
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Amount in paise
            currency: "inr",
            metadata: { userId: userId.toString() },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return res.status(200).json(new ApiResponse(200, {
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount
        }, "Payment Intent created"));
    } catch (stripeError) {
        console.error("Stripe PaymentIntent Error:", stripeError);
        throw new ApiError(500, stripeError.message || "Failed to create payment intent with Stripe");
    }
});

export { createPaymentIntent };
