import { useState } from "react";
import { analyzeRequest } from "../services/api";
import { imageToBase64 } from "../utils/imageToBase64";

const useAnalyze = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const analyze = async ({ file, textInput, mode }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let payload = {
        text: textInput,   // ✅ was "textInput", server expects "text"
        mode,
      };

      if (file) {
        const { base64, mimeType } = await imageToBase64(file);
        payload = { ...payload, imageBase64: base64, mimeType };
      }

      const data = await analyzeRequest(payload);

      // Server returns { success, mode, analysis } — unwrap the analysis
      const result = data?.analysis ?? data;
      setResult(result);
      return result;

    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { analyze, loading, error, result, reset };
};

export default useAnalyze;