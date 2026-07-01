const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const MODEL_CHAIN = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), ms)
    ),
  ]);
}

async function generateWithFallback(prompt, { maxRetries = 3, timeoutMs = 20000 } = {}) {
  for (const modelName of MODEL_CHAIN) {
    const model = genAI.getGenerativeModel({ model: modelName });
    let delay = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await withTimeout(model.generateContent(prompt), timeoutMs);
        return { text: result.response.text(), modelUsed: modelName };
      } catch (err) {
        const isOverloaded =
          err.message?.includes("503") ||
          err.message?.includes("overloaded") ||
          err.message === "TIMEOUT";

        if (!isOverloaded) throw err; // real error, don't retry blindly

        console.warn(`${modelName} overloaded/timeout, attempt ${attempt + 1}`);
        if (attempt < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, delay + Math.random() * 300)); // jitter
          delay *= 2; // exponential backoff
        }
      }
    }
    
  }
  throw new Error("All Gemini models overloaded — try Claude fallback or retry later");
}

module.exports = { generateWithFallback };