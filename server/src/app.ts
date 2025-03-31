import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";  // Security headers
 // Compress responses

config(); // Load env variables early

const app = express();

// Security & Performance Middlewares
app.use(helmet());


// CORS Configuration (Allows frontend to communicate with backend)
app.use(
  cors({
    origin: "http://localhost:5173", // Ensure frontend URL matches
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes
app.use("/api/v1", appRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
