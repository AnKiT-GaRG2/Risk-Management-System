import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";

dotenv.config(); // Load .env variables

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/api/returns", returnRoutes);

// Server setup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
