import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config.js"
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import otpVerifyRouter from "./routes/otpVerifyRoute.js";
import adminRouter from "./routes/adminRoute.js";
import cookieParser from "cookie-parser";

// app config
const app = express()
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json())
app.use(cors())

// connection
connectDB();

// api endpoints
app.use(cookieParser());
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/v", otpVerifyRouter);
app.use("/api/admin", adminRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})
