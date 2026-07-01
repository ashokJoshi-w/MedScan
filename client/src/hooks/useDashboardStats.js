import { useState, useEffect } from "react";

const API = "http://localhost:3001/api";
const getToken = () => localStorage.getItem("medscan_token");

function getTrend(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function useDashboardStats() {
  const [stats, setStats] = useState({
    total: 0,
    prescriptions: 0,
    labReports: 0,
    vitalsLogged: 0,
    recentActivity: [],
    trends: { total: 0, prescriptions: 0, labReports: 0, vitals: 0 },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts from dashboard stats endpoint
        const [statsRes, reportsRes] = await Promise.all([
          fetch(`${API}/dashboard/stats`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${API}/reports`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        const statsData  = await statsRes.json();
        const reportsData = await reportsRes.json();

        // Build recent activity from latest 5 reports
        const recentActivity = reportsData.slice(0, 5).map((item) => ({
          id:     item._id,
          type:   item.type === "report" ? "lab" : item.type,
          title:  item.fileName || "Analysis record",
          date:   new Date(item.createdAt).toLocaleString("en-IN"),
          status: item.status || "normal",
        }));

        // Trend calculation — compare this week vs last week from reports list
        const now        = new Date();
        const weekAgo    = new Date(now - 7  * 86400000);
        const twoWeeksAgo = new Date(now - 14 * 86400000);

        const inRange = (start, end) =>
          reportsData.filter((r) => {
            const d = new Date(r.createdAt);
            return d >= start && d < end;
          });

        const thisWeek = inRange(weekAgo, now);
        const lastWeek = inRange(twoWeeksAgo, weekAgo);

        const countType = (arr, type) => arr.filter((r) => r.type === type).length;

        setStats({
          total:        statsData.total,
          prescriptions: statsData.prescriptions,
          labReports:   statsData.reports,
          vitalsLogged: statsData.vitals,
          recentActivity,
          trends: {
            total:         getTrend(thisWeek.length, lastWeek.length),
            prescriptions: getTrend(countType(thisWeek, "prescription"), countType(lastWeek, "prescription")),
            labReports:    getTrend(countType(thisWeek, "report"),       countType(lastWeek, "report")),
            vitals:        getTrend(countType(thisWeek, "vitals"),       countType(lastWeek, "vitals")),
          },
        });

      } catch (err) {
        console.error("useDashboardStats error:", err.message);
      }
    };

    fetchStats();
  }, []);

  return stats;
}