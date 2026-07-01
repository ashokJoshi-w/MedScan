import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";  // ← new

import analyzeRoute from "./routes/analyze.js";
import authRoute from "./routes/auth.js";
import reportsRoute from "./routes/reports.js";    // ← new
import vitalsRoute from "./models/Vitals.js";      // ← new
import dashboardRoute from "./routes/dashboard.js"; // ← new

// ── MongoDB connect ──────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
connectDB(); // ← new

// ── Guards ───────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dev-secret-change-in-production";
  console.warn("JWT_SECRET not set — using insecure dev default");
}

const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
  console.warn("⚠  GEMINI_API_KEY is missing or invalid");
}

// ── App ──────────────────────────────────────────────────────
const app = express();

const allowedOrigins = process.env.CLIENT_URL?.split(",") || [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoute);
app.use("/api/analyze", analyzeRoute);
app.use("/api/reports", reportsRoute);     // ← new
app.use("/api/vitals", vitalsRoute);       // ← new
app.use("/api/dashboard", dashboardRoute); // ← new

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));