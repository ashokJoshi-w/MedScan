import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import analyzeRoute from "./routes/analyze.js";
import authRoute from "./routes/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dev-secret-change-in-production";
  console.warn("JWT_SECRET not set — using insecure dev default");
}

const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
  console.warn("⚠  GEMINI_API_KEY is missing or invalid — prescription/lab/vitals analysis will fail.");
  console.warn("   Get a key at https://aistudio.google.com/apikey and add it to .env");
}

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoute);
app.use("/api", analyzeRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));