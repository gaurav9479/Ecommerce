import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getMyProducts,
    getProductById,
    getFeaturedProducts,
    getFlashDeals,
    getRelatedProducts
} from "../controllers/product.controller.js";

const router = express.Router();


router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/flash-deals", getFlashDeals);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);


router.post("/", verifyJWT, authorizeRoles("retailer"), createProduct);
router.put("/:id", verifyJWT, authorizeRoles("retailer"), updateProduct);
router.delete("/:id", verifyJWT, authorizeRoles("retailer"), deleteProduct);
router.get("/my/products", verifyJWT, authorizeRoles("retailer"), getMyProducts);

export default router;
