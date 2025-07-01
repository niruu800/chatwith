import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userModal = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  avatar: {
    type: String, // cloudinar url
    required: true,
  },
});

userModal.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userModal.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userModal.methods.generateTokem = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
};
export const User = mongoose.model("User", userModal);
