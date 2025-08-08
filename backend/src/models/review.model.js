import mongoose, { Schema } from "mongoose";

const reviewSchema=new Schema(
    {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: Date
    }

)