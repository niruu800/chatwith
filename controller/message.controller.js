import { Message } from "../model/message.modal.js";

export const sendMessage = async (req, res) => {
  try {
    const { sendar, receiver, content } = req.body;

    if (!sendar || !receiver || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const savedMessage = await Message.create({ sendar, receiver, content });
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      content: savedMessage, // ✅ yeh hona chahiye
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

//!//////////////////////////
export const getMessage = async (req, res) => {
  try {
    const { sendarId, receiverId } = req.query;
    const message = await Message.find({
      $or: [
        { sendar: sendarId, receiver: receiverId },
        { sendar: receiverId, receiver: sendarId },
      ],
    }).sort({ createdAt: 1 });
    return res.status(200).json({
      data: message,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};
