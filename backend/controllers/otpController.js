import crypto from "crypto";
import nodemailer from "nodemailer";
import userOtpVerificationModel from "../models/userOtpVerificationModel.js";
import { createToken } from "./userController.js";
import userModel from "../models/userModel.js";

const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const otp = crypto.randomInt(100000, 999999).toString();

        await userOtpVerificationModel.create({
            email,
            otp,
            createdAt: Date.now(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        });

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for Signup",
            text: `Your OTP for signup is ${otp}. It is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error sending OTP" });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await userOtpVerificationModel.findOne({ email }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "OTP not found" });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        const user = await userModel.findOne({ email });
        const token = createToken(user._id);
        await userModel.findByIdAndUpdate(user._id, { verified: true });
        res.status(200).json({ success: true, message: "OTP verified", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error verifying OTP" });
    }
};


const deleteExpiredOtps = async (req, res) => {
    try {
        const toBeDeleted = await userOtpVerificationModel.find({ createdAt: { $lt : Date.now() - 5 * 60 * 1000}}, '_id');

        await userOtpVerificationModel.deleteMany({_id: { $in: toBeDeleted },})
        res.json({success: true, message: "Expired Otp Deleted"})
    } catch (error) {
        res.json({success: false, message: "Can't Delete Expired Otps, ERROR"});
    }
}

export { sendOtp, verifyOtp, deleteExpiredOtps };
