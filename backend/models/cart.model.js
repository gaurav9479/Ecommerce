import { Schema } from "mongoose";

const cartSchema=new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        items: [
            {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number
            }
        ],
        createdAt: Date,
        updatedAt: Date
    }

)