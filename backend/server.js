
import connectDB from "./db/index.js"
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({ 
    path: "./.env",
    quiet:"true"

    });

connectDB()
.then(()=>{
    app.listen(process.env.PORT||9000,()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed!!!",err);
})
