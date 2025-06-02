import { Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

const COOKIE_DOMAIN = process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : "localhost";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    if (await User.findOne({ email })) return res.status(409).json({ message: "User already registered" });

    const hashedPassword = await hash(password, 10);
    const user = await new User({ name, email, password: hashedPassword }).save();
    
    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: COOKIE_DOMAIN,
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(201).json({ message: "User registered successfully", user: { name, email } });
  } catch (error) {
    console.error("❌ Error in userSignup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await compare(password, user.password))) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: COOKIE_DOMAIN,
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(200).json({ message: "Login successful", user: { name: user.name, email } });
  } catch (error) {
    console.error("❌ Error in userLogin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData?.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found or token invalid" });

    res.status(200).json({ message: "User verified", user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("❌ Error in verifyUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: COOKIE_DOMAIN,
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("❌ Error in userLogout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
