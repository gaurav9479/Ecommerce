import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🧩 Create Product
export const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, category, imageUrl } = req.body;

    const product = await Product.create({
        name,
        price,
        description,
        category,
        imageUrl,
        imageUrl,
        owner: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

// 🧩 Update Product with ownership check
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    // Ownership check
    if (req.user.role !== "admin" && product.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only modify your own products");
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

// 🧩 Delete Product with ownership check
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    if (req.user.role !== "admin" && product.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own products");
    }

    await product.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

// 🧩 Get all products (public) with search, filters, pagination, and sorting
export const getAllProducts = asyncHandler(async (req, res) => {
    const {
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
        sort = '-createdAt',
        page = 1,
        limit = 12
    } = req.query;

    // Build filter object
    const filter = {};

    // Search in title, description, and tags
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];
    }

    // Category filter
    if (category && category !== 'all') {
        filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
        filter.rating = { $gte: Number(minRating) };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch products with filters
    const products = await Product.find(filter)
        .populate("owner", "name email")
        .sort(sort)
        .limit(Number(limit))
        .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, {
        products,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
        }
    }, "Products fetched successfully"));
});

// 🧩 Get retailer's own products
export const getMyProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ owner: req.user._id });
    res.status(200).json(new ApiResponse(200, products, "Your products fetched"));
});

// 🧩 Get product by ID with reviews populated
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('owner', 'name email')
        .populate({
            path: 'reviews',
            populate: { path: 'user', select: 'name email' },
            options: { sort: { createdAt: -1 } }
        });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

// 🧩 Get featured products for homepage
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 8;

    const products = await Product.find({ featured: true })
        .sort('-rating -createdAt')
        .limit(limit);

    res.status(200).json(new ApiResponse(200, products, "Featured products fetched"));
});
