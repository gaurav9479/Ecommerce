import { Coupon } from "../models/coupon.model.js";

// PUBLIC: Validate a coupon code (no auth needed)
export const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code) return res.status(400).json({ success: false, message: "Coupon code is required" });

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

        if (!coupon) return res.status(404).json({ success: false, message: "Invalid coupon code" });
        if (!coupon.isActive) return res.status(400).json({ success: false, message: "Coupon is no longer active" });
        if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: "Coupon has reached maximum uses" });
        if (new Date() > coupon.expiresAt) return res.status(400).json({ success: false, message: "Coupon has expired" });
        if (orderAmount && orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({ success: false, message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` });
        }

        res.json({
            success: true,
            message: "Coupon applied successfully!",
            data: {
                code: coupon.code,
                discountPercent: coupon.discountPercent,
                description: coupon.description
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ADMIN: Create coupon
export const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ADMIN: Get all coupons
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN: Toggle coupon active status
export const toggleCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN: Delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Coupon deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
