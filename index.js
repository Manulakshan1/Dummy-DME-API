import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import ordersRouter from "./routes/orders.js";
import authRouter from "./routes/auth.js";
import dmesRouter from "./routes/dmes.js";

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dme_orders";

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/dmes", dmesRouter);


async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { autoIndex: true });
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Mongo connection error:", err);
    process.exit(1);
  }
}

start();