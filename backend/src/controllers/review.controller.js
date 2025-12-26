import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🧩 Create a review for a product
export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    // Create review
    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment
    });

    // Update product rating
    await product.updateRating();

    const populatedReview = await Review.findById(review._id)
        .populate('user', 'Name email');

    res.status(201).json(new ApiResponse(201, populatedReview, "Review created successfully"));
});

// 🧩 Get all reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
        .populate('user', 'Name email')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// 🧩 Update own review
export const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only edit your own reviews");
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    await product.updateRating();

    const updatedReview = await Review.findById(reviewId)
        .populate('user', 'Name email');

    res.status(200).json(new ApiResponse(200, updatedReview, "Review updated successfully"));
});

// 🧩 Delete own review
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own reviews");
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating
    const product = await Product.findById(productId);
    await product.updateRating();

    res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
});
