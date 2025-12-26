import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL.replace(/\/$/, "");
        const connnectionInstance = await mongoose.connect(`${mongoUrl}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST:${connnectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}
export default connectDB