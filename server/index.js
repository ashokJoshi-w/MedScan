import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyze.js";

dotenv.config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api", analyzeRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));