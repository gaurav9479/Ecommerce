import express from "express";
import {
    sendOTP,
    verifyOTP,
} from "../controllers/auth.controller.js";

const router = express.Router();

// OTP-based login routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
