import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};


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


export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});


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


export const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
        throw new ApiError(400, "At least one field is required");
    }

    const user = await User.findById(req.user._id);

    if (name) user.name = name;

    // Check if email/phone is being updated and is unique
    if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) throw new ApiError(409, "Email already exists");
        user.email = email;
    }

    if (phone && phone !== user.phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) throw new ApiError(409, "Phone number already exists");
        user.phone = phone;
    }

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
});


export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, { user: req.user }, "Current user fetched successfully"));
});


export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) throw new ApiError(401, "Invalid old password");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});
