import express from "express"
import { deleteExpiredOtps, sendOtp, verifyOtp } from "../controllers/otpController.js";

const otpVerifyRouter = express.Router();

otpVerifyRouter.post("/verifyOtp", verifyOtp);
otpVerifyRouter.post("/sendOtp", sendOtp);
otpVerifyRouter.post("/deleteOtp", deleteExpiredOtps);

export default otpVerifyRouter;
