import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountPercent: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    maxUses: {
        type: Number,
        default: 100
    },
    usedCount: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export const Coupon = mongoose.model("Coupon", couponSchema);
