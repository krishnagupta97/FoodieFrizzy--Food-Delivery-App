import mongoose from "mongoose";

const userOtpVerificationSchema = mongoose.Schema({
    email: String,
    otp: String,
    createdAt: Date,
    expireAt: Date,
});

const userOtpVerificationModel = mongoose.model("UserOtpVerification", userOtpVerificationSchema);

export default userOtpVerificationModel;
