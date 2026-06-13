import express from "express";
import { extractText } from "../services/geminiService.js";
import { analyzeText } from "../services/claudeService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType, textInput, mode } = req.body;

    let text = textInput;

    if (imageBase64) {
      text = await extractText(imageBase64, mimeType);
    }

    const result = await analyzeText(text, mode);
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;