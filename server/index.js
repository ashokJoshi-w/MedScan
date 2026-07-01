import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import analyzeRoute from "./routes/analyze.js";
import authRoute from "./routes/auth.js";

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dev-secret-change-in-production";
  console.warn("JWT_SECRET not set — using insecure dev default");
}

const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
  console.warn("⚠  GEMINI_API_KEY is missing or invalid");
}

const app = express();

const allowedOrigins = process.env.CLIENT_URL?.split(",") || [];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoute);
app.use("/api/analyze", analyzeRoute);  // ← fixed

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));