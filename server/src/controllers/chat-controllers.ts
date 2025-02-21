import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { generateAIResponse } from "../services/ai.service.js"; // Import AI service
import dotenv from "dotenv";

dotenv.config();

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData?.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    user.chats.push({ content: message, role: "user" });
    
    const chatMessage = await generateAIResponse(message); // Call AI service
    if (!chatMessage) {
      return res.status(500).json({ message: "AI response was invalid" });
    }

    user.chats.push({ role: "assistant", content: chatMessage });
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error("Error in generateChatCompletion:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData?.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.error("Error in sendChatsToUser:", error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
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
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    user.chats.splice(0, user.chats.length);
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error("Error in deleteChats:", error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
