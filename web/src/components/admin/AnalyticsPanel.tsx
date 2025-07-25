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
  const [reportStats, setReportStats] = useState<number[]>([1, 2, 1, 3, 2, 4, 1]); // dummy data
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    setLabels(["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "Yesterday", "Today"]);
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/users/analytics", {
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
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_16px_#4320d10a] p-8 mb-8">
      <h2 className="text-[22px] font-bold mb-4 text-[#4320d1]">Analytics (Last 7 Days)</h2>
      <div className="text-[16px] font-medium text-[#4320d1] mb-2.5">
        Total Users: {totalUsers}
      </div>
      {loading ? (
        <div className="text-[#888] text-[16px]">Loading analytics...</div>
      ) : error ? (
        <div className="text-[#e53e3e] text-[16px]">{error}</div>
      ) : (
        <div className="flex gap-10 flex-wrap">
          <div className="flex-1 min-w-[320px]">
            <h3 className="text-[18px] font-semibold mb-2">New Users</h3>
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
          <div className="flex-1 min-w-[320px]">
            <h3 className="text-[18px] font-semibold mb-2">Reports</h3>
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
