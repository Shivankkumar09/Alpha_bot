"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChats = exports.sendChatsToUser = exports.generateChatCompletion = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const ai_service_js_1 = require("../services/ai.service.js"); // Import AI service
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User_js_1.default.findById(res.locals.jwtData?.id);
        if (!user) {
            return res
                .status(401)
                .json({ message: "User not registered OR Token malfunctioned" });
        }
        user.chats.push({ content: message, role: "user" });
        const chatMessage = await (0, ai_service_js_1.generateAIResponse)(message); // Call AI service
        if (!chatMessage) {
            return res.status(500).json({ message: "AI response was invalid" });
        }
        user.chats.push({ role: "assistant", content: chatMessage });
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.error("Error in generateChatCompletion:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
exports.generateChatCompletion = generateChatCompletion;
const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User_js_1.default.findById(res.locals.jwtData?.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.error("Error in sendChatsToUser:", error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
exports.sendChatsToUser = sendChatsToUser;
const deleteChats = async (req, res, next) => {
    try {
        const user = await User_js_1.default.findById(res.locals.jwtData?.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        user.chats.splice(0, user.chats.length);
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.error("Error in deleteChats:", error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
exports.deleteChats = deleteChats;
//# sourceMappingURL=chat-controllers.js.map