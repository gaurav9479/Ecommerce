import mongoose, { Schema } from "mongoose";

const categorySchema=new Schema(
    {
        name: String,
        description: String,
        createdAt: Date
    }
)
export const Category=mongoose.model("Category",categorySchema)