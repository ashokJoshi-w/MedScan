import { useState } from "react";

const STORAGE_KEY = "medscan_history";

const useHistory = () => {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (entry) => {
    const updated = [
      { ...entry, date: new Date().toLocaleString("en-IN") },
      ...history,
    ].slice(0, 20);

    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addToHistory, clearHistory };
};

export default useHistory;