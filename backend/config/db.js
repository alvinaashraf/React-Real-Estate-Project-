import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://alvina1409b_db_user:RealEstate12345@cluster0.yjjmryz.mongodb.net/RealState"
        );

        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error.message);
    }
};