import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders
} from "../controllers/order.controller.js";

const router = express.Router();


router.use(verifyJWT);


router.post("/create", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/status", authorizeRoles("admin"), updateOrderStatus);
router.get("/admin/all", authorizeRoles("admin"), getAllOrders);

export default router;
