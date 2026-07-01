import express from "express";
import multer from "multer";
import { extractText, askAboutReport } from "../services/geminiService.js";
import { analyzeText } from "../services/AnalyzeText.js";

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



const handleAnalysis = async (req, res, mode) => {
  try {
    
    if (req.file) {
      const base64 = toBase64(req.file.buffer);
      const mimeType = req.file.mimetype;

      
      const extractedText = await extractText(base64, mimeType);
      if (!extractedText?.trim()) {
        return res.status(422).json({ error: "Could not read text from the uploaded document." });
      }

      
      const analysis = await analyzeText(extractedText, mode);
      return res.json({ success: true, mode, analysis });
    }

    
    const { text } = req.body;
    if (text?.trim()) {
      const analysis = await analyzeText(text, mode);
      return res.json({ success: true, mode, analysis });
    }

    return res.status(400).json({ error: "No file or text provided." });

  } catch (err) {
    console.error(`[POST /api/analyze/${mode}]`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};



router.post("/", async (req, res) => {
  try {
    const { text, mode } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "No text provided." });

    const analysis = await analyzeText(text, mode || "general");
    res.json({ success: true, mode, analysis });

  } catch (err) {
    console.error("[POST /api/analyze]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});



router.post("/prescription", upload.single("document"), (req, res) =>
  handleAnalysis(req, res, "prescription")
);



router.post("/lab-report", upload.single("document"), (req, res) =>
  handleAnalysis(req, res, "lab")
);


router.post("/vitals", upload.single("document"), (req, res) =>
  handleAnalysis(req, res, "vitals")
);


router.post("/auto", upload.single("document"), (req, res) =>
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

    const base64 = toBase64(req.file.buffer);
    const mimeType = req.file.mimetype;
    const answer = await askAboutReport(base64, mimeType, question);

    res.json({ success: true, question, answer });
  } catch (err) {
    console.error("[POST /ask]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});



router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum 10MB." });
  }
  res.status(400).json({ error: err.message });
});

export default router;
