import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders
} from "../controllers/order.controller.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// User routes
router.post("/create", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/:orderId", getOrderById);

// Admin routes (add middleware check for admin in production)
router.patch("/:orderId/status", updateOrderStatus);
router.get("/admin/all", getAllOrders);

export default router;
