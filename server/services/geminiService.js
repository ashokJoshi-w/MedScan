import { GoogleGenerativeAI } from "@google/generative-ai";
const { generateWithFallback } = require("./geminiFallback");
import fs from "fs";
import path from "path";



const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add a valid key to your .env file."
    );
  }
  return new GoogleGenerativeAI(apiKey);
};



const toInlinePart = (base64, mimeType) => ({
  inlineData: { data: base64, mimeType: mimeType || "image/jpeg" },
});

const getMimeType = (filename) => {
  const map = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".pdf": "application/pdf", ".gif": "image/gif" };
  return map[path.extname(filename).toLowerCase()] || "image/jpeg";
};

const fileToInlinePart = (filePath) => {
  const base64 = fs.readFileSync(filePath).toString("base64");
  return toInlinePart(base64, getMimeType(filePath));
};

const getModel = () => {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // ✅ one place to change model
};



export const extractText = async (base64, mimeType) => {
  try {
    const model = getModel(); // ✅ fixed — was `gemini.getGenerativeModel` (gemini undefined)

    const result = await model.generateContent([
      `You are a medical OCR engine. Extract ALL text from this medical document exactly as written.
Include every word, number, dosage, lab value, date, and doctor/patient name.
Preserve the original structure and layout as closely as possible.
Return ONLY the raw extracted text — no commentary, no markdown, no formatting labels.`,
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



export const analyzePrescription = async (base64, mimeType) => {
  try {
    const model = getModel();

    const result = await model.generateContent([
      `You are an expert clinical pharmacist analyzing a prescription image.
Return ONLY valid JSON — no markdown, no explanation:
{
  "patientInfo": { "name": null, "age": null, "gender": null, "date": null },
  "doctorInfo": { "name": null, "specialization": null, "clinic": null, "contact": null },
  "medications": [{ "name": "", "genericName": "", "dosage": "", "frequency": "", "duration": "", "route": "", "instructions": "", "warnings": [] }],
  "diagnosis": null,
  "advice": null,
  "followUp": null,
  "drugInteractions": [],
  "summary": ""
}`,
      toInlinePart(base64, mimeType),
    ]);

    const raw = result.response.text()?.trim();
    if (!raw) throw new Error("No response from Gemini.");
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(clean);

  } catch (err) {
    console.error("[analyzePrescription] Error:", err.message);
    throw new Error(`Prescription analysis failed: ${err.message}`);
  }
};



export const analyzeLabReport = async (base64, mimeType) => {
  try {
    const model = getModel();

    const result = await model.generateContent([
      `You are a senior clinical pathologist analyzing a lab report image.
Return ONLY valid JSON — no markdown, no explanation:
{
  "patientInfo": { "name": null, "age": null, "gender": null, "sampleDate": null, "reportDate": null, "labName": null, "referredBy": null },
  "testResults": [{ "testName": "", "value": "", "unit": "", "referenceRange": "", "status": "Normal|High|Low|Critical High|Critical Low", "interpretation": "" }],
  "abnormalFindings": [{ "test": "", "value": "", "concern": "", "urgency": "Routine|Moderate|Urgent|Critical" }],
  "overallAssessment": "",
  "recommendations": [],
  "requiresImmediateAttention": false,
  "specialistReferral": null,
  "summary": ""
}`,
      toInlinePart(base64, mimeType),
    ]);

    const raw = result.response.text()?.trim();
    if (!raw) throw new Error("No response from Gemini.");
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(clean);

  } catch (err) {
    console.error("[analyzeLabReport] Error:", err.message);
    throw new Error(`Lab report analysis failed: ${err.message}`);
  }
};



export const autoAnalyze = async (base64, mimeType) => {
  try {
    const model = getModel();

    const detectResult = await model.generateContent([
      `Classify this medical document as exactly one of: "prescription", "lab_report", "medical_image", "discharge_summary", "unknown". Return ONLY the single word.`,
      toInlinePart(base64, mimeType),
    ]);

    const docType = detectResult.response.text()?.trim().toLowerCase();

    let analysis;
    if (docType === "prescription") analysis = await analyzePrescription(base64, mimeType);
    else if (docType === "lab_report") analysis = await analyzeLabReport(base64, mimeType);
    else analysis = await genericMedicalAnalysis(base64, mimeType);

    return { documentType: docType, analysis };

  } catch (err) {
    console.error("[autoAnalyze] Error:", err.message);
    throw new Error(`Auto-analysis failed: ${err.message}`);
  }
};



export const genericMedicalAnalysis = async (base64, mimeType) => {
  try {
    const model = getModel();

    const result = await model.generateContent([
      `Analyze this medical document. Return ONLY valid JSON:
{ "documentType": "", "patientInfo": { "name": null, "age": null, "gender": null, "date": null }, "keyFindings": [], "medications": [], "diagnoses": [], "procedures": [], "importantDates": [], "actionItems": [], "summary": "" }`,
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



export const askAboutReport = async (base64, mimeType, question) => {
  try {
    const model = getModel();

    const result = await model.generateContent([
      `You are a helpful medical AI assistant. Answer this question about the uploaded medical document.
Question: "${question}"
Answer clearly in plain English. Keep it under 200 words. Remind the user to consult their doctor for personalized advice.`,
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



export const analyzeFromFile = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
    const part = fileToInlinePart(filePath);
    return await autoAnalyze(part.inlineData.data, part.inlineData.mimeType);
  } catch (err) {
    console.error("[analyzeFromFile] Error:", err.message);
    throw new Error(`File analysis failed: ${err.message}`);
  }
};