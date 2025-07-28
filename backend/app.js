import express from "express"
import cookierParser from "cookie-parser"
import cors from "cors"
const app=express()
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials:true

}))
console.log("CORS Origin: ", process.env.CORS_ORIGIN);
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookierParser())

import router from "./routes/user.routes.js"
app.use("/api/v1/users",router);
export {app}

