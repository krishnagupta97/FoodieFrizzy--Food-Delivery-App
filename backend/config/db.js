import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://ishanbeast662:mongodbfood@cluster0.kzhge.mongodb.net/food-del").then(() => console.log("DB Connected"))
}

