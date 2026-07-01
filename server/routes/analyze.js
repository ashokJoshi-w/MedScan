import express from "express";
import multer from "multer";
import { extractText, askAboutReport } from "../services/geminiService.js";
import { analyzeText } from "../services/AnalyzeText.js";
import { protect } from "../middleware/authMiddleware.js";  // ← new
import Report from "../models/Report.js";                   // ← new

const router = express.Router();

// ─── Multer Config ────────────────────────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf", "image/gif"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Unsupported file type. Upload JPG, PNG, WEBP, GIF, or PDF."));
  },
});

const toBase64 = (buffer) => buffer.toString("base64");

// mode → report type mapping
const modeToType = {
  prescription: "prescription",
  lab:          "report",
  vitals:       "vitals",
  general:      "report",
};

const handleAnalysis = async (req, res, mode) => {
  try {
    let analysis;

    if (req.file) {
      const base64  = toBase64(req.file.buffer);
      const mimeType = req.file.mimetype;

      const extractedText = await extractText(base64, mimeType);
      if (!extractedText?.trim()) {
        return res.status(422).json({ error: "Could not read text from the uploaded document." });
      }

      analysis = await analyzeText(extractedText, mode);

      // ── Save to MongoDB if user is logged in ────────────────
      if (req.user?.id) {
        await Report.create({
          userId:         req.user.id,
          fileName:       req.file.originalname,
          analysisResult: analysis,
          status:         analysis?.status || "Normal",
          type:           modeToType[mode] || "report",
        });
      }

      return res.json({ success: true, mode, analysis });
    }

    const { text } = req.body;
    if (text?.trim()) {
      analysis = await analyzeText(text, mode);

      // ── Save to MongoDB if user is logged in ────────────────
      if (req.user?.id) {
        await Report.create({
          userId:         req.user.id,
          fileName:       "pasted-text",
          analysisResult: analysis,
          status:         analysis?.status || "Normal",
          type:           modeToType[mode] || "report",
        });
      }

      return res.json({ success: true, mode, analysis });
    }

    return res.status(400).json({ error: "No file or text provided." });

  } catch (err) {
    console.error(`[POST /api/analyze/${mode}]`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────
// protect is "optional" here — saves to DB if token present, works without it too

router.post("/", protect, async (req, res) => {
  try {
    const { text, mode } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "No text provided." });

    const analysis = await analyzeText(text, mode || "general");

    if (req.user?.id) {
      await Report.create({
        userId:         req.user.id,
        fileName:       "pasted-text",
        analysisResult: analysis,
        status:         analysis?.status || "Normal",
        type:           modeToType[mode] || "report",
      });
    }

    res.json({ success: true, mode, analysis });

  } catch (err) {
    console.error("[POST /api/analyze]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/prescription", protect, upload.single("document"), (req, res) =>
  handleAnalysis(req, res, "prescription")
);

router.post("/lab-report", protect, upload.single("document"), (req, res) =>
  handleAnalysis(req, res, "lab")
);

router.post("/vitals", protect, upload.single("document"), (req, res) =>
  handleAnalysis(req, res, "vitals")
);

router.post("/auto", protect, upload.single("document"), (req, res) =>
  handleAnalysis(req, res, "general")
);

router.post("/extract-text", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const text = await extractText(toBase64(req.file.buffer), req.file.mimetype);
    res.json({ success: true, text });
  } catch (err) {
    console.error("[POST /extract-text]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/ask", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const { question } = req.body;
    if (!question?.trim()) return res.status(400).json({ error: "No question provided." });

    const base64  = toBase64(req.file.buffer);
    const mimeType = req.file.mimetype;
    const answer  = await askAboutReport(base64, mimeType, question);

    res.json({ success: true, question, answer });
  } catch (err) {
    console.error("[POST /ask]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Error Handler ────────────────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum 10MB." });
  }
  res.status(400).json({ error: err.message });
});

export default router;