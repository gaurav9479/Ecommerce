import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart, getCart, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/add").post(addToCart);
router.route("/").get(getCart);
router.route("/remove/:productId").delete(removeFromCart);

export default router;
