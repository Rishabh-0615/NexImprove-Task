import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import prisma from "./config/prisma.js";
import { createDefaultAdmin } from "./controllers/adminController.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Neximprove API Running...");
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    await prisma.$connect();
    console.log("📦 Connected to PostgreSQL via Prisma");
    await createDefaultAdmin();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
