"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const index_js_1 = __importDefault(require("./routes/index.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet")); // Security headers
// Compress responses
(0, dotenv_1.config)(); // Load env variables early
const app = (0, express_1.default)();
// Security & Performance Middlewares
app.use((0, helmet_1.default)());
// CORS Configuration (Allows frontend to communicate with backend)
app.use((0, cors_1.default)({
    origin: "https://alpha-bot-five.vercel.app", // Ensure frontend URL matches
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
// Routes
app.use("/api/v1", index_js_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
exports.default = app;
//# sourceMappingURL=app.js.map