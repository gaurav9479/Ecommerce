import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity cannot be less than 1"]
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        shippingAddress: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            default: "Stripe"
        },
        paymentIntentId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Processing'
        },
        totalAmount: {
            type: Number,
            required: true
        },
        timeSlot: {
            type: String
        },
        location: {
            lat: Number,
            lng: Number
        },
        deliveredAt: Date
    },
    { timestamps: true }
)
export const Orders = mongoose.model("Orders", orderSchema)