import { Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import dotenv from "dotenv";

dotenv.config();

export const createToken = (id: string, email: string, expiresIn: string | number) => {
  const payload = { id, email };
  const secret = process.env.JWT_SECRET as Secret;
  const options: SignOptions = { expiresIn: expiresIn as any };
  const token = jwt.sign(payload, secret, options);
  console.log("Created Token:", token); // Log the token for debugging
  return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies[COOKIE_NAME];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  jwt.verify(token, process.env.JWT_SECRET as Secret, (err, success) => {
    if (err) {
      return res.status(401).json({ message: "Token Expired or Invalid" });
    } else {
      res.locals.jwtData = success;
      return next();
    }
  });
};
