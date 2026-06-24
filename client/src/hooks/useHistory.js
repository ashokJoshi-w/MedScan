import { useState } from "react";

const STORAGE_KEY = "medscan_history";

const useHistory = () => {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const persist = (updated) => {
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addToHistory = (entry) => {
    const updated = [
      {
        ...entry,
        id: entry.id ?? Date.now(),
        date: entry.date ?? new Date().toLocaleString("en-IN"),
        status: entry.status ?? "normal",
      },
      ...history,
    ].slice(0, 50);
    persist(updated);
  };

  const removeFromHistory = (id) => {
    persist(history.filter((item, index) => (item.id ?? index) !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addToHistory, removeFromHistory, clearHistory };
};

export default useHistory;