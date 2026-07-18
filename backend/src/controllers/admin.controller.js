import { Product } from "../models/product.model.js";
import { StockHistory } from "../models/stockHistory.model.js";
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

  if (user.role !== "admin") {
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
      const uploadedUrl = await uploadOnCloudinary(file.path);
      console.log("Cloudinary response:", uploadedUrl);
      if (uploadedUrl) images.push(uploadedUrl);
    }

    // allow vendor to set an initial reserved stock if provided
    const totalStock = Number(stock) || 0;
    const reservedStockInput = Number(req.body.reservedStock);
    const reservedStock = isNaN(reservedStockInput) ? 0 : Math.max(0, reservedStockInput);

    if (reservedStock > totalStock) {
      return res.status(400).json(new ApiError(400, "Initial reservedStock cannot exceed totalStock"));
    }

    const newProduct = await Product.create({
      title,
      price,
      description,
      category,
      image: images,
      totalStock,
      reservedStock,
      owner: req.user._id
    });

    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password, specialCode } = req.body;

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
    name,
    email,
    phone,
    password,
    role: "admin",
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


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.isDeleted = true;
  await user.save();
  return res.status(200).json(new ApiResponse(200, user, "User deactivated successfully"));
});

export const restoreUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.isDeleted = false;
  await user.save();
  return res.status(200).json(new ApiResponse(200, user, "User restored successfully"));
});

export const updateProductStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { totalStock, reservedStock } = req.body;

  if ((totalStock === undefined || totalStock === null) && (reservedStock === undefined || reservedStock === null)) {
    throw new ApiError(400, "Provide at least one of 'totalStock' or 'reservedStock' to update");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Authorize: Only the vendor owner can manage their inventory
  if (product.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to manage this product's inventory");
  }
  // normalize current values
  const stockBeforeTotal = product.totalStock || 0;
  const stockBeforeReserved = product.reservedStock || 0;

  let newTotal = stockBeforeTotal;
  let newReserved = stockBeforeReserved;

  if (totalStock !== undefined && totalStock !== null) {
    if (isNaN(totalStock)) throw new ApiError(400, "'totalStock' must be a number");
    newTotal = Math.max(0, parseInt(totalStock));
  }

  if (reservedStock !== undefined && reservedStock !== null) {
    if (isNaN(reservedStock)) throw new ApiError(400, "'reservedStock' must be a number");
    newReserved = Math.max(0, parseInt(reservedStock));
  }

  // validations
  if (newReserved > newTotal) {
    throw new ApiError(400, `Reserved stock (${newReserved}) cannot exceed total stock (${newTotal}).`);
  }

  // apply changes
  const historyEntries = [];

  if (newTotal !== stockBeforeTotal) {
    const quantityChange = newTotal - stockBeforeTotal;
    historyEntries.push({
      product: product._id,
      action: quantityChange > 0 ? "ADMIN_ADD" : "ADMIN_REDUCE",
      quantityChange,
      stockBefore: stockBeforeTotal,
      stockAfter: newTotal,
      performedBy: req.user._id,
      note: `Vendor adjusted total stock`
    });
    product.totalStock = newTotal;
  }

  if (newReserved !== stockBeforeReserved) {
    const quantityChange = newReserved - stockBeforeReserved;
    historyEntries.push({
      product: product._id,
      action: quantityChange > 0 ? "RESERVED" : "RESERVATION_RELEASED",
      quantityChange,
      stockBefore: stockBeforeReserved,
      stockAfter: newReserved,
      performedBy: req.user._id,
      note: `Vendor adjusted reserved stock`
    });
    product.reservedStock = newReserved;
  }

  if (historyEntries.length === 0) {
    return res.status(200).json(new ApiResponse(200, product, "No stock changes detected."));
  }

  await product.save();
  await StockHistory.insertMany(historyEntries);

  return res.status(200).json(
    new ApiResponse(200, product, "Product stock updated successfully. Available stock: " + product.availableStock)
  );
});

export const updateFlashDeal = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { isActive, discount, durationHours } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Authorize: Only owner can manage their flash deals
  if (product.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to manage this product's flash deal");
  }

  if (isActive) {
    if (!discount || discount < 0 || discount > 100) {
      throw new ApiError(400, "Valid discount percentage (0-100) is required to activate flash deal");
    }
    const hours = Number(durationHours) || 6;
    const expiresAt = new Date(Date.now() + hours * 3600000);
    
    product.flashDeal = { isActive: true, expiresAt };
    product.discount = discount;
  } else {
    product.flashDeal = { isActive: false, expiresAt: null };
    product.discount = 0;
  }

  await product.save();
  
  return res.status(200).json(
    new ApiResponse(200, product, isActive ? "Flash deal activated successfully" : "Flash deal deactivated")
  );
});

export { loginAdmin, registerAdmin, getAdminProducts };
