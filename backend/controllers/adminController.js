import adminModel from "../models/adminModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

export const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

const loginAdmin = async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body;

        const user = await adminModel.findOne({ email: loginEmail });

        if (!user) {
            return res.json({ success: false, message: "Admin doesn't exists" })
        }

        const isMatch = await bcrypt.compare(loginPassword, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Wrong Password Entered" });
        }

        const token = createToken(user._id);
        return res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const exists = await adminModel.findOne({ email });

        if (exists) {
            return res.json({ success: false, message: "User already exists !" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a valid password" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = await adminModel({
            name,
            email,
            password: hashedPassword,
        })

        const admin = await newAdmin.save();
        const token = createToken(admin._id);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.send({ success: false, message: "Signup Error" });
    }
}

export { loginAdmin, registerAdmin }
