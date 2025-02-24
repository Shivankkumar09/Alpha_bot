import { Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import dotenv from "dotenv";

dotenv.config();


export const createToken = (id: string, email: string, expiresIn: string | number) => {
  const payload = { id, email };

  // Ensure JWT_SECRET is defined and is a string
  const secret = process.env.JWT_SECRET as Secret;

  // Define sign options explicitly
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({ message: "Token Expired" });
      } else {
        resolve();
        res.locals.jwtData = success;
        return next();
      }
    });
  });
};