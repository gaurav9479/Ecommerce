import express from "express";
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Review routes
router.post("/", createReview);
router.get("/product/:productId", getProductReviews);
router.patch("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

export default router;
