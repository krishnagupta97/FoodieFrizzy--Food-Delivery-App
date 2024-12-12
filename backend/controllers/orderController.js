import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const placeOrder = async (req, res) => {
    const frontend_url = "https://food-delivery-website-frontend-ndjx.onrender.com";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const success_url = `${frontend_url}/verify?success=true&orderId=${newOrder._id}`;

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })

        const options = {
            amount: req.body.amount * 100 * 8,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                res.status(500).json({ success: false, payment: "failed" })
            }
            res.status(200).json({ success: true, data: order });
            // res.json({ success: true, session_url: success_url })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error !!!" });
    }
}

const verifyOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSign == razorpay_signature) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            return res.status(200).json({ success: true, message: "Payment Successfully!" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// delete redundant orders 
const deleteOrders = async (req, res) => {
    try {
        const userIds = await userModel.find({}, '_id');
        const userIdSet = new Set(userIds.map(user => user._id.toString()));

        const result = await orderModel.deleteMany({
            userId: { $nin: Array.from(userIdSet) }, 
        });
        console.log(result);
        
        res.json({success: true, message: "Deleted redundant orders"})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });        
    }
}

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId })
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        // deleteOrders();
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, deleteOrders }
