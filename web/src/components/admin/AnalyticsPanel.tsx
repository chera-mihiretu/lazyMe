"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AnalyticsPanel: React.FC = () => {
  const [userStats, setUserStats] = useState<number[]>([]);
  const [reportStats, setReportStats] = useState<number[]>([]);
  const [pendingReports, setPendingReports] = useState<number>(0);
  const [reviewedReports, setReviewedReports] = useState<number>(0);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    setLabels(["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "Yesterday", "Today"]);
    const token = localStorage.getItem("token");
    // Fetch user analytics
    fetch(`${baseUrl}/users/analytics`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then(data => {
        if (data && data.analytics) {
          setUserStats(data.analytics.new_users || []);
          setTotalUsers(data.analytics.total_users || 0);
        } else {
          setError("Invalid analytics data");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Error fetching analytics");
        setLoading(false);
      });

    // Fetch report analytics
    fetch(`${baseUrl}/reports/analytics`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch report analytics");
        return res.json();
      })
      .then(data => {
        if (data && data.reports) {
          if (Array.isArray(data.reports.report_each_day)) {
            setReportStats(data.reports.report_each_day);
          }
          setPendingReports(data.reports.pending_reports || 0);
          setReviewedReports(data.reports.reviewed_reports || 0);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_16px_#4320d10a] p-8 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-[#4320d1]">Analytics (Last 7 Days)</h2>
      <div className="text-base font-medium text-[#4320d1] mb-2.5">
        <div className="flex flex-wrap gap-6 mt-2">
          <span className="bg-[#f5f5ff] text-[#4320d1] rounded-lg px-4 py-1 text-sm font-semibold">Total Users: {totalUsers}</span>
          <span className="bg-[#f5f5ff] text-[#4320d1] rounded-lg px-4 py-1 text-sm font-semibold">Pending Reports: {pendingReports}</span>
          <span className="bg-[#f5f5ff] text-[#4320d1] rounded-lg px-4 py-1 text-sm font-semibold">Reviewed Reports: {reviewedReports}</span>
        </div>
      </div>
      {loading ? (
        <div className="text-[#888] text-base">Loading analytics...</div>
      ) : error ? (
        <div className="text-[#e53e3e] text-base">{error}</div>
      ) : (
        <div className="flex gap-10 flex-wrap">
          <div className="flex-1 min-w-[80vw] sm:min-w-[320px]">
            <h3 className="text-lg font-semibold mb-2">New Users</h3>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "New Users",
                    data: userStats,
                    borderColor: "#4320d1",
                    backgroundColor: "rgba(67,32,209,0.1)",
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { display: false }, beginAtZero: true },
                },
              }}
            />
          </div>
          <div className="flex-1 min-w-[80vw] sm:min-w-[320px]">
            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Reports",
                    data: reportStats,
                    borderColor: "#e53e3e",
                    backgroundColor: "rgba(229,62,62,0.1)",
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { display: false }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
