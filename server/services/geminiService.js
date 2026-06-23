import { GoogleGenerativeAI } from "@google/generative-ai";

const getGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured. Add a valid key to your .env file.");
  }
  return new GoogleGenerativeAI(apiKey);
};

export const extractText = async (base64, mimeType) => {
  const gemini = getGemini();
  const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    "Extract all text from this medical document exactly as written. Return only the raw text, nothing else.",
    {
      inlineData: {
        data: base64,
        mimeType: mimeType || "image/jpeg",
      },
    },
  ]);

  const text = result.response.text()?.trim();
  if (!text) {
    throw new Error("Could not read any text from the uploaded image.");
  }
  return text;
};
