import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractText = async (base64, mimeType) => {
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    "Extract all text from this medical document exactly as written. Return only the raw text, nothing else.",
    {
      inlineData: {
        data: base64,
        mimeType: mimeType,
      },
    },
  ]);

  return result.response.text();
};