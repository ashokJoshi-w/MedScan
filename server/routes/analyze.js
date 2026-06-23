import express from "express";
import { extractText } from "../services/geminiService.js";
import { analyzeText } from "../services/claudeService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, async (req, res) => {
  try {
    const { imageBase64, mimeType, textInput, mode } = req.body;

    if (!mode || !["prescription", "lab", "vitals"].includes(mode)) {
      return res.status(400).json({ error: "Invalid mode. Use prescription, lab, or vitals." });
    }

    let text = textInput?.trim() || "";

    if (imageBase64) {
      text = await extractText(imageBase64, mimeType);
    }

    if (!text) {
      return res.status(400).json({ error: "No prescription text found. Upload an image or paste text." });
    }

    const result = await analyzeText(text, mode);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
