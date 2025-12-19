import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (err) {
    console.error(err);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }

});
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



  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInAdmin = await User.findById(user._id).select("-password -refreshToken");

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInAdmin, accessToken, refreshToken }, "Admin logged in successfully"));
});






export const addProduct = asyncHandler(async (req, res) => {
  try {
    const { title, price, description, category, stock } = req.body;
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
      stock: stock || 0,
      owner: req.user._id
    });

    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { Name, email, phone, password, specialCode } = req.body;

  if (specialCode !== "VENDOR_SECRET_123") {
    throw new ApiError(403, "Invalid Vendor Code");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or phone already exists");
  }

  const vendorCode = "VEND" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const user = await User.create({
    Name,
    email,
    phone,
    password,
    isAdmin: true,
    vendorCode
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the admin");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "Admin registered successfully. Your Vendor Code is " + vendorCode)
  );
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ owner: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Admin products fetched successfully"));
});

export { loginAdmin, registerAdmin, getAdminProducts };
