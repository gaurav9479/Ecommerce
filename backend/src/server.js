import "./env.js";
import connectDB from "./db/index.js"
import { app } from "./app.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 9000, () => {
            console.log(`server is running at port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed!!!", err);
    })
