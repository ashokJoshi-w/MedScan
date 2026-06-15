import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

export const analyzeText = async (text, mode) => {
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompts[mode](text));
  const raw = result.response.text();
  console.log("Raw response:", raw);
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};