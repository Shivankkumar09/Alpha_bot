"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChats = exports.sendChatsToUser = exports.generateChatCompletion = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const ai_service_1 = require("../services/ai.service"); // Import AI service correctly
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }
        const user = await User_js_1.default.findById(res.locals.jwtData?.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        user.chats.push({ content: message, role: "user" });
        let chatMessage;
        try {
            chatMessage = await (0, ai_service_1.generateContent)(message); // Call AI service
            if (!chatMessage)
                throw new Error("AI response was invalid");
        }
        catch (err) {
            console.error("❌ AI Service Error:", err);
            return res.status(500).json({ message: "AI Service Failed", error: err.message });
        }
        user.chats.push({ role: "assistant", content: chatMessage });
        await user.save();
        return res.status(200).json({ message: "Chat added", chats: user.chats });
    }
    catch (error) {
        console.error("❌ Error in generateChatCompletion:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
exports.generateChatCompletion = generateChatCompletion;
const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User_js_1.default.findById(res.locals.jwtData?.id).populate("chats"); // Ensures fresh chats are fetched
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(403).json({ message: "Unauthorized Access" });
        }
        return res.status(200).json({ message: "Chats retrieved", chats: user.chats });
    }
    catch (error) {
        console.error("❌ Error in sendChatsToUser:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
exports.sendChatsToUser = sendChatsToUser;
const deleteChats = async (req, res, next) => {
    try {
        const user = await User_js_1.default.findById(res.locals.jwtData?.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(403).json({ message: "Unauthorized Access" });
        }
        user.chats.splice(0, user.chats.length); // Clear the chats array
        await user.save();
        return res.status(200).json({ message: "Chats deleted successfully" });
    }
    catch (error) {
        console.error("❌ Error in deleteChats:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
exports.deleteChats = deleteChats;
//# sourceMappingURL=chat-controllers.js.map