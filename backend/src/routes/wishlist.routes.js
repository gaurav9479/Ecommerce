import express from "express";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Wishlist routes
router.get("/", getWishlist);
router.post("/add", addToWishlist);
router.delete("/remove/:productId", removeFromWishlist);
router.post("/toggle", toggleWishlist);

export default router;
