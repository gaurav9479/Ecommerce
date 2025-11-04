import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        avatar: { type: String, default: "" },
        role: {
            type: String,
            enum: ["user", "retailer", "admin"],
            default: "user",
        },
        shopDetails: {
            shopName: String,
            gstNumber: String,
            address: String,
            bankDetails: {
                accountNumber: String,
                ifsc: String,
            },
        },
        refreshToken: { type: String, select: false },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        phoneVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

export const User = mongoose.model("User", userSchema);
