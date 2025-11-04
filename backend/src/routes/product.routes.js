import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getMyProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

// Public
router.get("/", getAllProducts);

// Retailer-only routes
router.post("/", verifyJWT, authorizeRoles("retailer"), createProduct);
router.put("/:id", verifyJWT, authorizeRoles("retailer"), updateProduct);
router.delete("/:id", verifyJWT, authorizeRoles("retailer"), deleteProduct);
router.get("/my/products", verifyJWT, authorizeRoles("retailer"), getMyProducts);

export default router;
