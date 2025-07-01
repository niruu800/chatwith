import uploadImage from "../middleware/cloudinary.js";
import { User } from "../model/user.modal.js";

export const allUser = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch {
    res.status(500).json({ message: "getting faild" });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => !field?.trim())) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists." });
    }

    const avatar = req.file?.path;
    if (!avatar) {
      return res.status(400).json({ message: "Please upload an avatar." });
    }

    const uploadedAvatar = await uploadImage(avatar);
    if (!uploadedAvatar?.secure_url) {
      return res.status(500).json({ message: "Failed to upload avatar." });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      avatar: uploadedAvatar.secure_url,
    });

    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password"
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "payload is missing" });
  }
  try {
    const { email, password } = req.body;

    // 🔍 Field check
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    // 🔍 Check user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Check password
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🪙 Generate token
    const token = user.generateTokem(); // Make sure method name is `.generateTokem()` in model

    // 👤 Remove password from response
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    // 📤 Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
