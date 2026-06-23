import { GoogleGenerativeAI } from "@google/generative-ai";

const getGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured. Add a valid key to your .env file.");
  }
  return new GoogleGenerativeAI(apiKey);
};

const prompts = {
  prescription: (text) => `You are MedScan, a bilingual medical AI assistant. Given this prescription, return ONLY a valid JSON array, no markdown, no explanation:
[{"name":"","dosage":"","purpose_en":"","purpose_hi":"","instructions_en":"","instructions_hi":"","side_effects_en":[],"side_effects_hi":[]}]
Prescription: ${text}`,

  lab: (text) => `You are MedScan, a bilingual medical AI assistant. Given these lab results, return ONLY valid JSON, no markdown, no explanation:
{"summary_en":"","summary_hi":"","values":[{"name":"","value":"","unit":"","status":"normal|high|low","meaning_en":"","meaning_hi":""}],"advice_en":"","advice_hi":""}
Lab results: ${text}`,

  vitals: (text) => `You are MedScan, a bilingual medical AI assistant. Given these vitals, return ONLY valid JSON, no markdown, no explanation:
{"summary_en":"","summary_hi":"","readings":[{"name":"","value":"","status":"normal|high|low","meaning_en":"","meaning_hi":""}],"advice_en":"","advice_hi":""}
Vitals: ${text}`,
};

const parseJsonResponse = (raw) => {
  const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("AI returned an invalid response. Please try again.");
  }
};

const friendlyGeminiError = (err) => {
  const msg = err.message || "";
  if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
    return new Error("GEMINI_API_KEY is invalid. Get a key at https://aistudio.google.com/apikey and update your .env file.");
  }
  return err;
};

export const analyzeText = async (text, mode) => {
  const prompt = prompts[mode];
  if (!prompt) throw new Error(`Unknown analysis mode: ${mode}`);

  try {
    const gemini = getGemini();
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt(text));
    const raw = result.response.text();
    return parseJsonResponse(raw);
  } catch (err) {
    throw friendlyGeminiError(err);
  }
};
