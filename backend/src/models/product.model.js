import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: [String], required: true },
    stock: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })


productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
});


productSchema.methods.updateRating = async function () {
    const Review = mongoose.model('Review');
    const stats = await Review.aggregate([
        { $match: { product: this._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
        this.rating = Math.round(stats[0].avgRating * 10) / 10;
        this.numReviews = stats[0].count;
    } else {
        this.rating = 0;
        this.numReviews = 0;
    }

    await this.save();
};

export const Product = mongoose.model("Product", productSchema)