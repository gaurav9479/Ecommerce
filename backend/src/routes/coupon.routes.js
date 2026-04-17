import express from "express";
import { validateCoupon, createCoupon, getAllCoupons, toggleCoupon, deleteCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

// Public
router.post("/validate", validateCoupon);

// Admin-only (you can add admin middleware here if needed)
router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.patch("/:id/toggle", toggleCoupon);
router.delete("/:id", deleteCoupon);

export default router;
