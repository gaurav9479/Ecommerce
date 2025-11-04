import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    deleteUser,
    restoreUser,
} from "../controllers/user.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    getAllUsers,
    getUserById,
    deactivateUser,
    restoreUser as adminRestoreUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// User authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.delete("/delete", verifyJWT, deleteUser);
router.post("/restore", restoreUser);

// Admin controls
router.get("/admin/users", verifyJWT, authorizeRoles("admin"), getAllUsers);
router.get("/admin/users/:id", verifyJWT, authorizeRoles("admin"), getUserById);
router.put("/admin/users/:id/deactivate", verifyJWT, authorizeRoles("admin"), deactivateUser);
router.put("/admin/users/:id/restore", verifyJWT, authorizeRoles("admin"), adminRestoreUser);

export default router;
