import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:3001/api";

const getToken = () => localStorage.getItem("medscan_token");

const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reports from MongoDB
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/reports`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      // Normalize MongoDB records to the shape the UI expects
      const normalized = data.map((item) => ({
        id:     item._id,
        type:   item.type,
        title:  item.fileName || "Analysis record",
        date:   new Date(item.createdAt).toLocaleString("en-IN"),
        status: item.status || "normal",
        analysisResult: item.analysisResult,
      }));

      setHistory(normalized);
    } catch (err) {
      console.error("useHistory fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // No longer needed to manually add — analyze route saves to DB automatically
  // But kept for compatibility with any page still calling it
  const addToHistory = useCallback(() => {
    fetchHistory(); // just re-fetch after a new analysis
  }, [fetchHistory]);

  const removeFromHistory = useCallback(async (id) => {
    try {
      await fetch(`${API}/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    // Delete all one by one
    await Promise.all(
      history.map((item) =>
        fetch(`${API}/reports/${item.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        })
      )
    );
    setHistory([]);
  }, [history]);

  return { history, loading, addToHistory, removeFromHistory, clearHistory, refetch: fetchHistory };
};

export default useHistory;
