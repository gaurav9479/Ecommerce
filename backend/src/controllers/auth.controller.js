import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js"; // we’ll create this next
import dotenv from "dotenv";

dotenv.config();

// configure mail transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER, // your Gmail
        pass: process.env.MAIL_PASS, // app password
    },
});

// STEP 1 — Send OTP
export const sendOTP = async (req, res) => {
    try {
        const { emailOrPhone } = req.body;
        if (!emailOrPhone) {
            return res.status(400).json({ message: "Email or phone is required" });
        }

        const email = emailOrPhone.trim();

        // Find user or create a placeholder user (optional)
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000);

        // Save OTP in DB with 5-min expiry
        const otp = new OTP({
            email,
            code: otpCode,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        await otp.save();

        // Send OTP via Email
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Your Login OTP Code",
            html: `
        <h3>Hi ${user.Name || "User"},</h3>
        <p>Your OTP for login is:</p>
        <h2>${otpCode}</h2>
        <p>This OTP will expire in 5 minutes.</p>
      `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email successfully!",
        });
    } catch (error) {
        console.error("OTP Send Error:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};

// STEP 2 — Verify OTP and login
export const verifyOTP = async (req, res) => {
    try {
        const { emailOrPhone, otp } = req.body;
        if (!emailOrPhone || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const email = emailOrPhone.trim();

        const record = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!record) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }

        if (record.code !== Number(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (record.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // clear OTP
        await OTP.deleteMany({ email });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
            token,
            data: user,
        });
    } catch (error) {
        console.error("OTP Verify Error:", error);
        return res.status(500).json({ message: "Failed to verify OTP" });
    }
};
