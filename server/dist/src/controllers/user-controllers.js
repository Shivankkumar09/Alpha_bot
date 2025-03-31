"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.verifyUser = exports.userLogin = exports.userSignup = exports.getAllUsers = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const bcrypt_1 = require("bcrypt");
const token_manager_js_1 = require("../utils/token-manager.js");
const constants_js_1 = require("../utils/constants.js");
const COOKIE_DOMAIN = process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : "localhost";
const getAllUsers = async (req, res) => {
    try {
        const users = await User_js_1.default.find().select("-password");
        res.status(200).json({ message: "Users fetched successfully", users });
    }
    catch (error) {
        console.error("❌ Error in getAllUsers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllUsers = getAllUsers;
const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required" });
        if (await User_js_1.default.findOne({ email }))
            return res.status(409).json({ message: "User already registered" });
        const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
        const user = await new User_js_1.default({ name, email, password: hashedPassword }).save();
        const token = (0, token_manager_js_1.createToken)(user._id.toString(), user.email, "7d");
        res.cookie(constants_js_1.COOKIE_NAME, token, {
            path: "/",
            domain: COOKIE_DOMAIN,
            httpOnly: true,
            signed: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ message: "User registered successfully", user: { name, email } });
    }
    catch (error) {
        console.error("❌ Error in userSignup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.userSignup = userSignup;
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required" });
        const user = await User_js_1.default.findOne({ email });
        if (!user || !(await (0, bcrypt_1.compare)(password, user.password)))
            return res.status(401).json({ message: "Invalid credentials" });
        const token = (0, token_manager_js_1.createToken)(user._id.toString(), user.email, "7d");
        res.cookie(constants_js_1.COOKIE_NAME, token, {
            path: "/",
            domain: COOKIE_DOMAIN,
            httpOnly: true,
            signed: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "Login successful", user: { name: user.name, email } });
    }
    catch (error) {
        console.error("❌ Error in userLogin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.userLogin = userLogin;
const verifyUser = async (req, res) => {
    try {
        const user = await User_js_1.default.findById(res.locals.jwtData?.id).select("-password");
        if (!user)
            return res.status(401).json({ message: "User not found or token invalid" });
        res.status(200).json({ message: "User verified", user: { name: user.name, email: user.email } });
    }
    catch (error) {
        console.error("❌ Error in verifyUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.verifyUser = verifyUser;
const userLogout = async (req, res) => {
    try {
        res.clearCookie(constants_js_1.COOKIE_NAME, {
            path: "/",
            domain: COOKIE_DOMAIN,
            httpOnly: true,
            signed: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("❌ Error in userLogout:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.userLogout = userLogout;
//# sourceMappingURL=user-controllers.js.map