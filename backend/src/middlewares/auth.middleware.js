import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🛡 Verify JWT Authentication
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new ApiError(401, "Unauthorized request");

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken");

        if (!user) throw new ApiError(401, "Invalid access token");
        if (user.isDeleted) throw new ApiError(403, "Account deactivated");

        req.user = user; // attach user to request object
        next();
    } catch (err) {
        throw new ApiError(401, "Token expired or invalid");
    }
});

// ⚙️ Role-based Authorization Middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "You do not have permission for this action");
        }
        next();
    };
};
