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
      let payload = { mode, textInput };

      if (file) {
        const { base64, mimeType } = await imageToBase64(file);
        payload = { ...payload, imageBase64: base64, mimeType };
      }

      const data = await analyzeRequest(payload);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
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