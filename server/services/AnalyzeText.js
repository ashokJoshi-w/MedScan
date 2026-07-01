import { GoogleGenerativeAI } from "@google/generative-ai";



const getGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add a valid key to your .env file."
    );
  }
  return new GoogleGenerativeAI(apiKey);
};


const prompts = {
  prescription: (text) => `You are MedScan, a bilingual medical AI assistant fluent in English and Hindi.
Analyze this prescription and return ONLY a valid JSON array — no markdown, no explanation, no extra text.

Schema (return an array of objects, one per medication):
[
  {
    "name": "drug name",
    "genericName": "generic/chemical name",
    "dosage": "e.g. 500mg",
    "frequency": "e.g. twice daily",
    "duration": "e.g. 7 days",
    "purpose_en": "what this drug treats in English",
    "purpose_hi": "यह दवा किस लिए है हिंदी में",
    "instructions_en": "how to take it in English",
    "instructions_hi": "इसे कैसे लें हिंदी में",
    "side_effects_en": ["side effect 1", "side effect 2"],
    "side_effects_hi": ["दुष्प्रभाव 1", "दुष्प्रभाव 2"],
    "warnings_en": ["important warning if any"],
    "warnings_hi": ["महत्वपूर्ण चेतावनी यदि कोई हो"]
  }
]

Prescription text:
${text}`,

  lab: (text) => `You are MedScan, a bilingual medical AI assistant fluent in English and Hindi.
Analyze these lab results and return ONLY valid JSON — no markdown, no explanation, no extra text.

Schema:
{
  "summary_en": "2-3 sentence overall summary in English",
  "summary_hi": "2-3 वाक्यों में हिंदी में सारांश",
  "values": [
    {
      "name": "test name",
      "value": "measured value",
      "unit": "unit e.g. mg/dL",
      "referenceRange": "normal range e.g. 70-110",
      "status": "normal | high | low | critical_high | critical_low",
      "meaning_en": "what this value means in English",
      "meaning_hi": "इसका मतलब हिंदी में"
    }
  ],
  "abnormalCount": 0,
  "requiresAttention": true,
  "advice_en": "actionable advice in English",
  "advice_hi": "हिंदी में सलाह",
  "followUp_en": "follow-up recommendation in English",
  "followUp_hi": "अनुवर्ती अनुशंसा हिंदी में"
}

Lab results text:
${text}`,

  vitals: (text) => `You are MedScan, a bilingual medical AI assistant fluent in English and Hindi.
Analyze these vitals and return ONLY valid JSON — no markdown, no explanation, no extra text.

Schema:
{
  "summary_en": "overall summary in English",
  "summary_hi": "हिंदी में सारांश",
  "readings": [
    {
      "name": "vital name e.g. Blood Pressure",
      "value": "measured value e.g. 120/80",
      "unit": "unit if applicable",
      "status": "normal | high | low | critical",
      "meaning_en": "what this means in English",
      "meaning_hi": "इसका मतलब हिंदी में"
    }
  ],
  "overallStatus": "normal | concerning | critical",
  "advice_en": "health advice in English",
  "advice_hi": "स्वास्थ्य सलाह हिंदी में"
}

Vitals text:
${text}`,

  general: (text) => `You are MedScan, a bilingual medical AI assistant fluent in English and Hindi.
Analyze this medical document and return ONLY valid JSON — no markdown, no explanation.

Schema:
{
  "documentType": "what type of document this is",
  "summary_en": "plain English summary",
  "summary_hi": "हिंदी में सारांश",
  "keyPoints_en": ["key finding 1", "key finding 2"],
  "keyPoints_hi": ["मुख्य बिंदु 1", "मुख्य बिंदु 2"],
  "medications": ["any medications mentioned"],
  "diagnoses": ["any diagnoses or conditions"],
  "advice_en": "advice in English",
  "advice_hi": "हिंदी में सलाह"
}

Document text:
${text}`,
};



const parseJsonResponse = (raw) => {

  const clean = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    
    const jsonMatch = clean.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // fall through
      }
    }
    throw new Error("AI returned an invalid response format. Please try again.");
  }
};

const friendlyError = (err) => {
  const msg = err.message || "";
  if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
    return new Error(
      "Invalid Gemini API key. Get a free key at https://aistudio.google.com/apikey and update your .env file."
    );
  }
  if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
    return new Error("Gemini API rate limit reached. Please wait a moment and try again.");
  }
  if (msg.includes("SAFETY")) {
    return new Error("The document was blocked by Gemini safety filters. Try a different document.");
  }
  return err;
};


/**
 * analyzeText - Takes extracted text and analyzes it by mode
 *
 * @param {string} text  - Raw text extracted from the medical document
 * @param {string} mode  - "prescription" | "lab" | "vitals" | "general"
 * @returns {Promise<object|array>} - Structured bilingual JSON result
 */
export const analyzeText = async (text, mode) => {
  if (!text?.trim()) throw new Error("No text provided for analysis.");

  const buildPrompt = prompts[mode] || prompts.general;

  try {
    const gemini = getGemini();
    const model = gemini.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2,      
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(buildPrompt(text));
    const raw = result.response.text();

    if (!raw?.trim()) {
      throw new Error("Gemini returned an empty response. Please try again.");
    }

    return parseJsonResponse(raw);

  } catch (err) {
    throw friendlyError(err);
  }
};



/**
 * 
 *
 * @param {string} base64    - Base64 encoded image/PDF
 * @param {string} mimeType  - MIME type e.g. "image/jpeg"
 * @param {string} mode      - "prescription" | "lab" | "vitals" | "general"
 */
export const analyzeImage = async (base64, mimeType, mode) => {
  // Import extractText from geminiService to avoid duplication
  const { extractText } = await import("./geminiService.js");

  const text = await extractText(base64, mimeType);
  if (!text?.trim()) throw new Error("Could not extract text from the uploaded document.");

  const analysis = await analyzeText(text, mode);
  return { extractedText: text, analysis, mode };
};