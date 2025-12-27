import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'product' },
                quantity: Number
            }
        ]
    }, { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);