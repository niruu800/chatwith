import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.DB);
    console.log(`MongoDB connected ✅`);
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};
export default connectDB;
