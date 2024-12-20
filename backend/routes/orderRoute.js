import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, deleteOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.post("/delete", deleteOrders);

export default orderRouter;
