"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_js_1 = require("./constants.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: expiresIn };
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    console.log("Created Token:", token); // Log the token for debugging
    return token;
};
exports.createToken = createToken;
const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[constants_js_1.COOKIE_NAME];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token Not Received" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, success) => {
        if (err) {
            return res.status(401).json({ message: "Token Expired or Invalid" });
        }
        else {
            res.locals.jwtData = success;
            return next();
        }
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=token-manager.js.map