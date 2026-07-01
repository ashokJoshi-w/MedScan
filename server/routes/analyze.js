import express from "express";
import multer from "multer";
import {
  extractText,
  analyzePrescription,
  analyzeLabReport,
  autoAnalyze,
  askAboutReport,
} from "../services/geminiService.js";
import { analyzeText } from "../services/analyzeText.js";

const router = express.Router();

// ─── Multer Config ────────────────────────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Upload JPG, PNG, WEBP, GIF, or PDF."));
    }
  },
});

const toBase64 = (buffer) => buffer.toString("base64");

// ─── POST /api/analyze ───────────────────────────────────────────────────────
// ✅ This is what your frontend calls with { text, mode }

router.post("/", async (req, res) => {
  try {
    const { text, mode } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "No text provided." });
    }

    const analysisMode = mode || "prescription";
    const analysis = await analyzeText(text, analysisMode);

    res.json({ success: true, mode: analysisMode, analysis });

  } catch (err) {
    console.error("[POST /api/analyze]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/analyze/auto ───────────────────────────────────────────────────

router.post("/auto", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const base64 = toBase64(req.file.buffer);
    const mimeType = req.file.mimetype;

    const result = await autoAnalyze(base64, mimeType);
    res.json({ success: true, ...result });

  } catch (err) {
    console.error("[POST /auto]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/analyze/prescription ──────────────────────────────────────────

router.post("/prescription", upload.single("document"), async (req, res) => {
  try {
    // If image uploaded → OCR + analyze
    if (req.file) {
      const base64 = toBase64(req.file.buffer);
      const mimeType = req.file.mimetype;
      const analysis = await analyzePrescription(base64, mimeType);
      return res.json({ success: true, documentType: "prescription", analysis });
    }

    // If plain text sent → analyze directly
    const { text } = req.body;
    if (text?.trim()) {
      const analysis = await analyzeText(text, "prescription");
      return res.json({ success: true, documentType: "prescription", analysis });
    }

    return res.status(400).json({ error: "No file or text provided." });

  } catch (err) {
    console.error("[POST /prescription]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/analyze/lab-report ────────────────────────────────────────────

router.post("/lab-report", upload.single("document"), async (req, res) => {
  try {
    if (req.file) {
      const base64 = toBase64(req.file.buffer);
      const mimeType = req.file.mimetype;
      const analysis = await analyzeLabReport(base64, mimeType);
      return res.json({ success: true, documentType: "lab_report", analysis });
    }

    const { text } = req.body;
    if (text?.trim()) {
      const analysis = await analyzeText(text, "lab");
      return res.json({ success: true, documentType: "lab_report", analysis });
    }

    return res.status(400).json({ error: "No file or text provided." });

  } catch (err) {
    console.error("[POST /lab-report]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/analyze/vitals ─────────────────────────────────────────────────

router.post("/vitals", upload.single("document"), async (req, res) => {
  try {
    if (req.file) {
      const base64 = toBase64(req.file.buffer);
      const mimeType = req.file.mimetype;
      const text = await extractText(base64, mimeType);
      const analysis = await analyzeText(text, "vitals");
      return res.json({ success: true, documentType: "vitals", analysis });
    }

    const { text } = req.body;
    if (text?.trim()) {
      const analysis = await analyzeText(text, "vitals");
      return res.json({ success: true, documentType: "vitals", analysis });
    }

    return res.status(400).json({ error: "No file or text provided." });

  } catch (err) {
    console.error("[POST /vitals]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/analyze/extract-text ──────────────────────────────────────────

router.post("/extract-text", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const base64 = toBase64(req.file.buffer);
    const mimeType = req.file.mimetype;
    const text = await extractText(base64, mimeType);

    res.json({ success: true, text });

  } catch (err) {
    console.error("[POST /extract-text]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/analyze/ask ────────────────────────────────────────────────────

router.post("/ask", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const { question } = req.body;
    if (!question?.trim()) return res.status(400).json({ error: "No question provided." });

    const base64 = toBase64(req.file.buffer);
    const mimeType = req.file.mimetype;
    const answer = await askAboutReport(base64, mimeType, question);

    res.json({ success: true, question, answer });

  } catch (err) {
    console.error("[POST /ask]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Multer Error Handler ─────────────────────────────────────────────────────

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum 10MB." });
    }
  }
  res.status(400).json({ error: err.message });
});

export default router;