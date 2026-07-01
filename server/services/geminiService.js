import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// ─── Client Initializer ───────────────────────────────────────────────────────

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add a valid key to your .env file."
    );
  }
  return new GoogleGenerativeAI(apiKey);
};

// ─── Helper: File/Base64 → Gemini Part ───────────────────────────────────────

const toInlinePart = (base64, mimeType) => ({
  inlineData: {
    data: base64,
    mimeType: mimeType || "image/jpeg",
  },
});

// Detect MIME type from file extension
const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".gif": "image/gif",
  };
  return map[ext] || "image/jpeg";
};

// Convert a local file path to base64 inline part
const fileToInlinePart = (filePath) => {
  const data = fs.readFileSync(filePath);
  const base64 = data.toString("base64");
  const mimeType = getMimeType(filePath);
  return toInlinePart(base64, mimeType);
};

// ─── 1. Extract Raw Text from Medical Document ────────────────────────────────

export const extractText = async (base64, mimeType) => {
  try {
    const genAI = getGeminiClient();
    const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a medical OCR engine. Extract ALL text from this medical document exactly as written.
Include every word, number, dosage, lab value, date, and doctor/patient name.
Preserve the original structure and layout as closely as possible.
Return ONLY the raw extracted text — no commentary, no markdown, no formatting labels.`;

    const result = await model.generateContent([
      prompt,
      toInlinePart(base64, mimeType),
    ]);

    const text = result.response.text()?.trim();
    if (!text) throw new Error("Could not read any text from the uploaded document.");
    return text;

  } catch (err) {
    console.error("[extractText] Error:", err.message);
    throw new Error(`Text extraction failed: ${err.message}`);
  }
};

// ─── 2. Analyze Prescription ──────────────────────────────────────────────────

export const analyzePrescription = async (base64, mimeType) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert clinical pharmacist analyzing a prescription image.
Extract and analyze the prescription. Return a JSON object with this exact structure:

{
  "patientInfo": {
    "name": "string or null",
    "age": "string or null",
    "gender": "string or null",
    "date": "string or null"
  },
  "doctorInfo": {
    "name": "string or null",
    "specialization": "string or null",
    "clinic": "string or null",
    "contact": "string or null"
  },
  "medications": [
    {
      "name": "drug name",
      "genericName": "generic name if known",
      "dosage": "e.g. 500mg",
      "frequency": "e.g. twice daily",
      "duration": "e.g. 7 days",
      "route": "e.g. oral",
      "instructions": "e.g. take after meals",
      "warnings": ["list of important warnings for this drug"]
    }
  ],
  "diagnosis": "string or null",
  "advice": "any general advice written on prescription",
  "followUp": "follow-up date or instruction if mentioned",
  "drugInteractions": ["list any potential interactions between prescribed drugs"],
  "summary": "2-3 sentence plain-English summary of this prescription"
}

Return ONLY valid JSON. No markdown, no explanation, no extra text.`;

    const result = await model.generateContent([
      prompt,
      toInlinePart(base64, mimeType),
    ]);

    const raw = result.response.text()?.trim();
    if (!raw) throw new Error("No response from Gemini for prescription analysis.");

    // Strip markdown code fences if present
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(clean);

  } catch (err) {
    console.error("[analyzePrescription] Error:", err.message);
    throw new Error(`Prescription analysis failed: ${err.message}`);
  }
};

// ─── 3. Analyze Lab Report ────────────────────────────────────────────────────

export const analyzeLabReport = async (base64, mimeType) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a senior clinical pathologist analyzing a lab report image.
Extract all test results and analyze them medically. Return a JSON object with this exact structure:

{
  "patientInfo": {
    "name": "string or null",
    "age": "string or null",
    "gender": "string or null",
    "sampleDate": "string or null",
    "reportDate": "string or null",
    "labName": "string or null",
    "referredBy": "string or null"
  },
  "testResults": [
    {
      "testName": "name of the test",
      "value": "measured value with unit",
      "unit": "unit of measurement",
      "referenceRange": "normal range e.g. 70-110 mg/dL",
      "status": "Normal | High | Low | Critical High | Critical Low",
      "interpretation": "brief clinical interpretation of this result"
    }
  ],
  "abnormalFindings": [
    {
      "test": "test name",
      "value": "value",
      "concern": "why this is concerning",
      "urgency": "Routine | Moderate | Urgent | Critical"
    }
  ],
  "overallAssessment": "paragraph summarizing the overall health picture from these results",
  "recommendations": ["list of actionable recommendations based on results"],
  "requiresImmediateAttention": true or false,
  "specialistReferral": "which specialist to see if needed, or null",
  "summary": "2-3 sentence plain-English summary a patient can understand"
}

Return ONLY valid JSON. No markdown, no explanation, no extra text.`;

    const result = await model.generateContent([
      prompt,
      toInlinePart(base64, mimeType),
    ]);

    const raw = result.response.text()?.trim();
    if (!raw) throw new Error("No response from Gemini for lab report analysis.");

    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(clean);

  } catch (err) {
    console.error("[analyzeLabReport] Error:", err.message);
    throw new Error(`Lab report analysis failed: ${err.message}`);
  }
};

// ─── 4. Auto-Detect Document Type & Analyze ───────────────────────────────────

export const autoAnalyze = async (base64, mimeType) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Step 1: Detect document type
    const detectPrompt = `Look at this medical document image. 
Classify it as exactly one of: "prescription", "lab_report", "medical_image", "discharge_summary", "unknown".
Return ONLY the single classification word, nothing else.`;

    const detectResult = await model.generateContent([
      detectPrompt,
      toInlinePart(base64, mimeType),
    ]);

    const docType = detectResult.response.text()?.trim().toLowerCase();

    // Step 2: Route to appropriate analyzer
    let analysis;
    if (docType === "prescription") {
      analysis = await analyzePrescription(base64, mimeType);
    } else if (docType === "lab_report") {
      analysis = await analyzeLabReport(base64, mimeType);
    } else {
      // Fallback: generic medical document analysis
      analysis = await genericMedicalAnalysis(base64, mimeType);
    }

    return { documentType: docType, analysis };

  } catch (err) {
    console.error("[autoAnalyze] Error:", err.message);
    throw new Error(`Auto-analysis failed: ${err.message}`);
  }
};

// ─── 5. Generic Medical Document Analysis (Fallback) ─────────────────────────

export const genericMedicalAnalysis = async (base64, mimeType) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a medical AI assistant. Analyze this medical document thoroughly.
Return a JSON object with this structure:

{
  "documentType": "what type of document this appears to be",
  "patientInfo": { "name": null, "age": null, "gender": null, "date": null },
  "keyFindings": ["list of key medical findings or information"],
  "medications": ["any medications mentioned"],
  "diagnoses": ["any diagnoses or conditions mentioned"],
  "procedures": ["any procedures or tests mentioned"],
  "importantDates": ["any important dates"],
  "actionItems": ["things the patient or doctor should do"],
  "summary": "plain-English summary of this document"
}

Return ONLY valid JSON. No markdown, no extra text.`;

    const result = await model.generateContent([
      prompt,
      toInlinePart(base64, mimeType),
    ]);

    const raw = result.response.text()?.trim();
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(clean);

  } catch (err) {
    console.error("[genericMedicalAnalysis] Error:", err.message);
    throw new Error(`Generic analysis failed: ${err.message}`);
  }
};

// ─── 6. Ask Follow-up Question About a Report ────────────────────────────────

export const askAboutReport = async (base64, mimeType, question) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful medical AI assistant. The user has uploaded a medical document and is asking a question about it.

User's question: "${question}"

Answer clearly and in plain English. Be accurate but accessible. 
If the answer involves medical advice, remind the user to consult their doctor for personalized guidance.
Keep your response concise (under 200 words unless more detail is truly needed).`;

    const result = await model.generateContent([
      prompt,
      toInlinePart(base64, mimeType),
    ]);

    const answer = result.response.text()?.trim();
    if (!answer) throw new Error("No answer received from Gemini.");
    return answer;

  } catch (err) {
    console.error("[askAboutReport] Error:", err.message);
    throw new Error(`Q&A failed: ${err.message}`);
  }
};

// ─── 7. Analyze from Local File Path (Server-side utility) ───────────────────

export const analyzeFromFile = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const part = fileToInlinePart(filePath);
    return await autoAnalyze(part.inlineData.data, part.inlineData.mimeType);
  } catch (err) {
    console.error("[analyzeFromFile] Error:", err.message);
    throw new Error(`File analysis failed: ${err.message}`);
  }
};

// ─── Exports Summary ──────────────────────────────────────────────────────────
// extractText(base64, mimeType)          → raw OCR text
// analyzePrescription(base64, mimeType)  → structured prescription JSON
// analyzeLabReport(base64, mimeType)     → structured lab results JSON
// autoAnalyze(base64, mimeType)          → auto-detect type + analyze
// genericMedicalAnalysis(base64, mimeType) → fallback generic analysis
// askAboutReport(base64, mimeType, q)   → answer a question about the doc
// analyzeFromFile(filePath)              → analyze a local file by path