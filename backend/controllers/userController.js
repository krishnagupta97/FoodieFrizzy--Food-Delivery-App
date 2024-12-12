import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

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

export const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email })

        // checking if user already exists
        if (exists) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        // checking email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // checking for strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a valid password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.send({ success: true, message: "Kindly Verify Your Account" });
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: "Signup Error" });
    }
}

export { loginUser, registerUser }
