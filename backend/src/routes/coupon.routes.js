import express from "express";
import { validateCoupon, createCoupon, getAllCoupons, toggleCoupon, deleteCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();


router.post("/validate", validateCoupon);


router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.patch("/:id/toggle", toggleCoupon);
router.delete("/:id", deleteCoupon);

export default router;
