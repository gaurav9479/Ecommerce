import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// 👑 Admin: Fetch all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
});

// 👑 Admin: Fetch a specific user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// 👑 Admin: Deactivate a user (soft delete)
export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "User deactivated successfully"));
});

// 👑 Admin: Restore a deactivated user
export const restoreUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "User restored successfully"));
});


const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const getAllProducts =async(req,res)=>{
  try {
    const products=await Product.find();
    res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));  
  } catch (err) {
    console.error(err);
    res.status(500).json(new ApiError(500, "Internal Server Error")); 
  }

};

const loginAdmin = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    throw new ApiError(400, "Phone and password are required");
  }

  const user = await User.findOne({ phone }).select("+password");
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (!user.isAdmin) {
    throw new ApiError(403, "Only admins can login here");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens, set cookies, etc.
  // (Use your existing generateAccessAndRefreshToken helper)

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInAdmin = await User.findById(user._id).select("-password -refreshToken");

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInAdmin, accessToken, refreshToken }, "Admin logged in successfully"));
});






export const addProduct = async (req, res) => {
  try {
    const { title, price, description,category} = req.body;
     console.log("Files received:", req.files);

    const images = [];

    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path);
      console.log("Cloudinary response:", uploaded);
      if (uploaded?.url) images.push(uploaded.url);
    }

    const newProduct = await Product.create({
      title,
      price,
      description,
      category,
      image: images,
    });

    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};
export { loginAdmin };
