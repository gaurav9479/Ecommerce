import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPaymentIntent } from "../controllers/payment.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/create-payment-intent").post(createPaymentIntent);

export default router;
