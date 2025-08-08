import mongoose, { Schema } from "mongoose";

const orderSchema=new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        orderItems: [
            {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            price: Number
            }
        ],
        shippingAddress: String,
        paymentMethod: String,
        paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
        totalAmount: Number,
        orderStatus: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
        createdAt: Date,
        deliveredAt: Date
    }

)
export const Orders=mongoose.model("Orders",orderSchema)