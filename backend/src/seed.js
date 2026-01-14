import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Product } from "./models/product.model.js";
import { Review } from "./models/review.model.js";
import { DB_NAME } from "./constants.js";

dotenv.config({ path: "./.env" });

const categories = ["smartphones", "laptops", "headphones", "cameras", "tablets", "accessories", "watches"];

const productNames = {
    smartphones: ["iPhone 15 Pro", "Samsung Galaxy S24 Ultra", "Google Pixel 8", "OnePlus 12", "Xiaomi 14 Pro", "Nothing Phone 2", "Sony Xperia 1 V"],
    laptops: ["MacBook Pro M3", "Dell XPS 15", "HP Spectre x360", "Lenovo ThinkPad X1 Carbon", "ASUS ROG Zephyrus", "Razer Blade 16"],
    headphones: ["Sony WH-1000XM5", "Bose QuietComfort Ultra", "AirPods Max", "Sennheiser Momentum 4", "JBL Tour One M2"],
    cameras: ["Sony A7 IV", "Canon EOS R5", "Nikon Z9", "Fujifilm X-T5", "Panasonic Lumix GH6", "DJI Osmo Pocket 3"],
    tablets: ["iPad Pro 12.9", "Samsung Galaxy Tab S9 Ultra", "Microsoft Surface Pro 9", "Xiaomi Pad 6", "Lenovo Tab P12"],
    accessories: ["Logitech MX Master 3S", "Keychron Q1", "Apple MagSafe Charger", "Anker 737 Power Bank", "Samsung T7 SSD"],
    watches: ["Apple Watch Ultra 2", "Samsung Galaxy Watch 6 Pro", "Garmin Fenix 7 Pro", "Pixel Watch 2", "Rolex Submariner (Replica)"]
};

const reviewsPool = [
    "Amazing product, really worth the price!",
    "Good quality but the shipping took a bit longer than expected.",
    "Excellent performance. Highly recommended!",
    "Decent product for the price point.",
    "Absolutely love it! Best purchase this year.",
    "The build quality is premium, feels great in hand.",
    "Average experience, could be better.",
    "Outstanding battery life and display.",
    "A bit overpriced, but the features are top-notch.",
    "Exceeded my expectations! 5 stars."
];

const seedDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL.replace(/\/$/, "");
        await mongoose.connect(`${mongoUrl}/${DB_NAME}`);
        console.log("Connected to MongoDB for seeding...");

        // 1. Ensure we have users/vendors
        let users = await User.find().limit(20);
        if (users.length < 5) {
            console.log("Not enough users found. Creating demo users...");
            const demoUsers = [];
            for (let i = 0; i < 10; i++) {
                demoUsers.push({
                    name: `User ${i + 1}`,
                    email: `user${Date.now()}${i}@example.com`,
                    phone: `98765432${i}${i}`,
                    password: "password123",
                    role: i % 3 === 0 ? "retailer" : "user"
                });
            }
            users = await User.insertMany(demoUsers);
        }

        const retailers = users.filter(u => u.role === "retailer");
        const regularUsers = users.filter(u => u.role === "user");

        if (retailers.length === 0) {
            console.log("No retailers found. Promoting some users...");
            await User.updateMany({ _id: { $in: users.slice(0, 3).map(u => u._id) } }, { role: "retailer" });
        }

        // 2. Clear existing products and reviews (optional, but requested to seed 100)
        // console.log("Clearing existing products and reviews...");
        // await Product.deleteMany({});
        // await Review.deleteMany({});

        console.log("Seeding 100 products...");
        const productsToInsert = [];

        for (let i = 0; i < 100; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const nameList = productNames[category] || ["Generic Tech Gadget"];
            const baseName = nameList[Math.floor(Math.random() * nameList.length)];
            const retailer = retailers[i % retailers.length] || users[0];

            productsToInsert.push({
                title: `${baseName} - Edition ${i + 1}`,
                price: Math.floor(Math.random() * 2000) + 50,
                description: `This is a premium ${baseName} designed for high performance and durability. Featuring the latest tech and sleek aesthetics, it is a perfect choice for professionals and enthusiasts alike.`,
                category: category,
                image: [`https://picsum.photos/seed/${i + 100}/800/800`], // High-res placeholder images
                stock: Math.floor(Math.random() * 50) + 10,
                owner: retailer._id,
                rating: 0, // Will be updated after reviews
                numReviews: 0,
                tags: [category, "premium", "trending", "tech"],
                featured: i % 10 === 0
            });
        }

        const insertedProducts = await Product.insertMany(productsToInsert);
        console.log(`Inserted ${insertedProducts.length} products.`);

        // 3. Seed Reviews for each product
        console.log("Seeding reviews for products...");
        const reviewsToInsert = [];

        for (const product of insertedProducts) {
            const numReviews = Math.floor(Math.random() * 5) + 2; // 2-6 reviews per product
            const reviewUsers = [...regularUsers].sort(() => 0.5 - Math.random()).slice(0, numReviews);

            for (const user of reviewUsers) {
                reviewsToInsert.push({
                    user: user._id,
                    product: product._id,
                    rating: Math.floor(Math.random() * 2) + 4, // Mostly 4-5 ratings
                    comment: reviewsPool[Math.floor(Math.random() * reviewsPool.length)]
                });
            }
        }

        await Review.insertMany(reviewsToInsert);
        console.log(`Inserted ${reviewsToInsert.length} reviews.`);

        // 4. Update product ratings and review counts
        console.log("Updating product ratings totals...");
        for (const product of insertedProducts) {
            await product.updateRating();
        }

        console.log("Seeding completed successfully! 🚀");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
