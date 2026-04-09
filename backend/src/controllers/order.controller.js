import { Orders as Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentIntentId, totalAmount, timeSlot, location } = req.body;
    const userId = req.user._id;

    if (req.user.role === "admin") {
        throw new ApiError(403, "Admins cannot make purchases.");
    }


    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }


    const orderItems = [];
    for (const item of cart.items) {
        const product = await Product.findById(item.product);

        if (!product) {
            throw new ApiError(404, `Product ${item.product._id} not found`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.title}`);
        }

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
        });


        product.stock -= item.quantity;
        await product.save();
    }


    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentIntentId,
        timeSlot,
        location,
        status: 'Processing'
    });


    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
        .populate('items.product')
        .populate('user', 'Name email');

    res.status(201).json(new ApiResponse(201, populatedOrder, "Order created successfully"));
});


export const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
        .populate('items.product')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await Order.countDocuments({ user: userId });

    res.status(200).json(new ApiResponse(200, {
        orders,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    }, "Orders fetched successfully"));
});


export const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId)
        .populate('items.product')
        .populate('user', 'Name email');

    if (!order) {
        throw new ApiError(404, "Order not found");
    }


    if (order.user._id.toString() !== userId.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You can only view your own orders");
    }

    res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});


export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.status = status;
    if (status === 'Delivered') {
        order.deliveredAt = new Date();
    }
    await order.save();

    const updatedOrder = await Order.findById(orderId)
        .populate('items.product')
        .populate('user', 'Name email');

    res.status(200).json(new ApiResponse(200, updatedOrder, "Order status updated successfully"));
});


export const getAllOrders = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
        .populate('items.product')
        .populate('user', 'Name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await Order.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, {
        orders,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    }, "Orders fetched successfully"));
});


// ─── Vendor Analytics ─────────────────────────────────────────────────────────
export const getAnalytics = asyncHandler(async (req, res) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 29);
    const sixtyDaysAgo  = new Date(now); sixtyDaysAgo.setDate(now.getDate() - 59);
    const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0);

    const [allOrders, products] = await Promise.all([
        Order.find().populate('items.product', 'title category price').sort({ createdAt: 1 }),
        Product.find({}, 'title price stock category compareCount rating numReviews')
    ]);

    // ── KPIs ──────────────────────────────────────────────────────────────────
    const delivered = allOrders.filter(o => o.status === 'Delivered');
    const thisMonth  = allOrders.filter(o => o.createdAt >= startOfMonth);
    const lastMonth  = allOrders.filter(o => o.createdAt >= startOfLastMonth && o.createdAt <= endOfLastMonth);

    const revenue       = delivered.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const revenueThis   = thisMonth.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.totalAmount, 0);
    const revenueLast   = lastMonth.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.totalAmount, 0);
    const revenueGrowth = revenueLast > 0 ? (((revenueThis - revenueLast) / revenueLast) * 100).toFixed(1) : null;
    const ordersGrowth  = lastMonth.length > 0 ? (((thisMonth.length - lastMonth.length) / lastMonth.length) * 100).toFixed(1) : null;
    const avgOrderValue = delivered.length > 0 ? Math.round(revenue / delivered.length) : 0;

    // ── Revenue over last 30 days ──────────────────────────────────────────────
    const revenueMap = {};
    for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo); d.setDate(thirtyDaysAgo.getDate() + i);
        const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        revenueMap[key] = 0;
    }
    allOrders.filter(o => o.status === 'Delivered' && o.createdAt >= thirtyDaysAgo).forEach(o => {
        const key = new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        if (revenueMap[key] !== undefined) revenueMap[key] += o.totalAmount || 0;
    });
    const revenueChart = Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue }));

    // ── Orders timeline (last 30 days, all statuses) ───────────────────────────
    const ordersMap = {};
    Object.keys(revenueMap).forEach(k => { ordersMap[k] = 0; });
    allOrders.filter(o => o.createdAt >= thirtyDaysAgo).forEach(o => {
        const key = new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        if (ordersMap[key] !== undefined) ordersMap[key]++;
    });
    const ordersChart = Object.entries(ordersMap).map(([date, orders]) => ({ date, orders }));

    // ── Order status breakdown ─────────────────────────────────────────────────
    const statusCount = { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    allOrders.forEach(o => { if (statusCount[o.status] !== undefined) statusCount[o.status]++; });
    const statusChart = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

    // ── Category revenue breakdown ─────────────────────────────────────────────
    const catMap = {};
    delivered.forEach(o => {
        o.items.forEach(item => {
            const cat = item.product?.category || 'Other';
            catMap[cat] = (catMap[cat] || 0) + (item.price || item.product?.price || 0) * item.quantity;
        });
    });
    const categoryChart = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, value]) => ({ name, value: Math.round(value) }));

    // ── Top 5 selling products ─────────────────────────────────────────────────
    const productSales = {};
    delivered.forEach(o => {
        o.items.forEach(item => {
            const id = item.product?._id?.toString();
            if (!id) return;
            if (!productSales[id]) productSales[id] = { name: item.product.title, units: 0, revenue: 0 };
            productSales[id].units   += item.quantity;
            productSales[id].revenue += (item.price || item.product.price) * item.quantity;
        });
    });
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(p => ({ ...p, revenue: Math.round(p.revenue) }));

    // ── Inventory health ──────────────────────────────────────────────────────
    const inventoryHealth = {
        healthy: products.filter(p => p.stock > 10).length,
        low:     products.filter(p => p.stock > 0 && p.stock <= 10).length,
        out:     products.filter(p => p.stock === 0).length,
    };

    // ── Weekly revenue heatmap (last 12 weeks) ────────────────────────────────
    const weekMap = {};
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i * 7);
        const key = `W${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`;
        weekMap[key] = 0;
    }
    delivered.forEach(o => {
        const d = new Date(o.createdAt);
        const weeksAgo = Math.floor((now - d) / (7 * 24 * 3600 * 1000));
        if (weeksAgo < 12) {
            const refDay = new Date(now); refDay.setDate(now.getDate() - weeksAgo * 7);
            const key = `W${refDay.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`;
            if (weekMap[key] !== undefined) weekMap[key] += o.totalAmount || 0;
        }
    });
    const weeklyChart = Object.entries(weekMap).map(([week, revenue]) => ({ week, revenue: Math.round(revenue) }));

    res.status(200).json(new ApiResponse(200, {
        kpis: {
            totalRevenue: revenue,
            totalOrders: allOrders.length,
            avgOrderValue,
            totalProducts: products.length,
            revenueGrowth,
            ordersGrowth,
            thisMonthRevenue: revenueThis,
            lastMonthRevenue: revenueLast,
            conversionRate: allOrders.length > 0 ? ((delivered.length / allOrders.length) * 100).toFixed(1) : 0,
        },
        revenueChart,
        ordersChart,
        statusChart,
        categoryChart,
        topProducts,
        inventoryHealth,
        weeklyChart,
    }, "Analytics fetched"));
});
