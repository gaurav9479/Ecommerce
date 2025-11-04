import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// Reusable token generator
const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

// 🧱 Register
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, role, shopDetails } = req.body;

    if ([name, email, password, phone].some((f) => !f?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) throw new ApiError(409, "Email or phone already registered");

    const user = await User.create({ name, email, password, phone, role, shopDetails });
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
    })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
        })
        .json(new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User registered successfully"));
});

// 🔑 Login (email or phone)
export const loginUser = asyncHandler(async (req, res) => {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password)
        throw new ApiError(400, "Email/Phone and password required");

    const user = await User.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select("+password +refreshToken");

    if (!user) throw new ApiError(404, "User does not exist");
    if (user.isDeleted) throw new ApiError(403, "Account is deleted");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "Login successful"));
});

// 🔁 Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select("+refreshToken");
    if (!user) throw new ApiError(401, "Invalid refresh token");
    if (incomingRefreshToken !== user.refreshToken)
        throw new ApiError(401, "Expired or mismatched refresh token");

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true })
        .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
});

// 🚪 Logout
export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// 🧼 Soft Delete + Anonymize
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    user.email = `deleted_${user._id}@archive.com`;
    user.phone = `deleted_${user._id}`;
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.refreshToken = undefined;

    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Account deleted successfully"));
});

// ♻️ Restore User
export const restoreUser = asyncHandler(async (req, res) => {
    const { userId, email, phone } = req.body;
    const user = await User.findOne({ _id: userId, isDeleted: true });
    if (!user) throw new ApiError(404, "No deleted account found");

    const conflict = await User.findOne({ $or: [{ email }, { phone }], isDeleted: false });
    if (conflict)
        throw new ApiError(400, "Email or phone already linked with another account");

    user.isDeleted = false;
    user.deletedAt = null;
    user.email = email;
    user.phone = phone;
    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    return res.status(200).json(new ApiResponse(200, { accessToken, refreshToken, user }, "Account restored successfully"));
});

// 🔧 Change Password
export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) throw new ApiError(401, "Invalid old password");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});
