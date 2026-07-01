import express from "express";
import multer from "multer";
import {
  extractText,
  analyzePrescription,
  analyzeLabReport,
  autoAnalyze,
  askAboutReport,
} from "../services/geminiService.js";

const router = express.Router();

// ─── Multer Config (memory storage → base64) ─────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Upload JPG, PNG, WEBP, GIF, or PDF."));
    }
  },
});

// Helper: convert uploaded buffer to base64
const toBase64 = (buffer) => buffer.toString("base64");

// ─── POST /api/analyze/auto ───────────────────────────────────────────────────
// Auto-detect document type and analyze

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
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const base64 = toBase64(req.file.buffer);
    const mimeType = req.file.mimetype;

    const analysis = await analyzePrescription(base64, mimeType);
    res.json({ success: true, documentType: "prescription", analysis });

  } catch (err) {
    console.error("[POST /prescription]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/analyze/lab-report ────────────────────────────────────────────

router.post("/lab-report", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const base64 = toBase64(req.file.buffer);
    const mimeType = req.file.mimetype;

    const analysis = await analyzeLabReport(base64, mimeType);
    res.json({ success: true, documentType: "lab_report", analysis });

  } catch (err) {
    console.error("[POST /lab-report]", err.message);
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

// ─── POST /api/analyze/ask ───────────────────────────────────────────────────
// Ask a follow-up question about an uploaded document

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

// ─── Global Multer Error Handler ─────────────────────────────────────────────

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
    }
  }
  res.status(400).json({ error: err.message });
});

export default router;