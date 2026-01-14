import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
} from "../controllers/cart.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

// Route: /api/v1/cart/
router.route("/").get(getCart);

// Route: /api/v1/cart/add
router.route("/add").post(addToCart);

// Route: /api/v1/cart/update
router.route("/update").patch(updateCartQuantity);

// Route: /api/v1/cart/remove/:productId
router.route("/remove/:productId").delete(removeFromCart);

export default router;
