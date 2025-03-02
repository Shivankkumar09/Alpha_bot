import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

//middlewares
app.use(
    cors({
      origin: "https://alpha-bot-virid.vercel.app", // Ensure it's exactly this
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));



//remove it in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

export default app;