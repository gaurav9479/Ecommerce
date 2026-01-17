import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }]
    },
    { timestamps: true }
);


wishlistSchema.methods.addProduct = function (productId) {
    if (!this.products.includes(productId)) {
        this.products.push(productId);
    }
    return this.save();
};


wishlistSchema.methods.removeProduct = function (productId) {
    this.products = this.products.filter(id => id.toString() !== productId.toString());
    return this.save();
};

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
