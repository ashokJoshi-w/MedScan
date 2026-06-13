import Anthropic from "@anthropic-ai/sdk";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
  const message = await claude.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompts[mode](text) }],
  });

  const raw = message.content[0].text;
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};