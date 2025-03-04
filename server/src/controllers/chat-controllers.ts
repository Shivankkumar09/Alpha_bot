import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { generateContent } from "../services/ai.service"; // Import AI service correctly
import dotenv from "dotenv";

dotenv.config();

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const user = await User.findById(res.locals.jwtData?.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }

    user.chats.push({ content: message, role: "user" });

    let chatMessage;
    try {
      chatMessage = await generateContent(message); // Call AI service
      if (!chatMessage) throw new Error("AI response was invalid");
    } catch (err) {
      console.error("❌ AI Service Error:", err);
      return res.status(500).json({ message: "AI Service Failed", error: (err as Error).message });
    }

    user.chats.push({ role: "assistant", content: chatMessage });
    await user.save();
    return res.status(200).json({ message: "Chat added", chats: user.chats });
  } catch (error) {
    console.error("❌ Error in generateChatCompletion:", error);
    return res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData?.id).populate("chats"); // Ensures fresh chats are fetched
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }

    return res.status(200).json({ message: "Chats retrieved", chats: user.chats });
  } catch (error) {
    console.error("❌ Error in sendChatsToUser:", error);
    return res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData?.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(403).json({ message: "Unauthorized Access" });
    }

    user.chats.splice(0, user.chats.length); // Clear the chats array
    await user.save();

    return res.status(200).json({ message: "Chats deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteChats:", error);
    return res.status(500).json({ message: "Something went wrong", error: (error as Error).message });
  }
};
