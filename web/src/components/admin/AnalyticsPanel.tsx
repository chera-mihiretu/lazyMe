"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { 
  Users, 
   
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  BarChart3,
  Activity,
  Loader2
} from 'lucide-react';

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

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      change: "+12%"
    },
    {
      title: "Pending Reports",
      value: pendingReports,
      icon: AlertCircle,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      change: "-5%"
    },
    {
      title: "Reviewed Reports",
      value: reviewedReports,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      change: "+8%"
    }
  ];

  return (
    <motion.div
      className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
        <span className="ml-3 px-3 py-1 bg-purple-100 border border-purple-200 rounded-full text-purple-700 text-sm">
          Last 7 Days
        </span>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-3 mb-4 shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-full h-full text-white" />
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    className="text-3xl font-bold text-gray-900 mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4, type: "spring" }}
                  >
                    {loading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </motion.div>

                  {/* Title and Change */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-600 text-sm font-medium group-hover:text-gray-900 transition-colors duration-300">
                      {stat.title}
                    </h3>
                    <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts */}
      {loading ? (
        <motion.div
          className="flex items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
          <span className="text-gray-600">Loading analytics...</span>
        </motion.div>
      ) : error ? (
        <motion.div
          className="flex items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
          <span className="text-red-500">{error}</span>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* New Users Chart */}
          <motion.div
            className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">New Users</h3>
            </div>
            <div className="h-64">
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "New Users",
                      data: userStats,
                      borderColor: "rgb(147, 51, 234)",
                      backgroundColor: "rgba(147, 51, 234, 0.1)",
                      tension: 0.4,
                      pointBackgroundColor: "rgb(147, 51, 234)",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      borderColor: "rgba(147, 51, 234, 0.5)",
                      borderWidth: 1,
                    }
                  },
                  scales: {
                    x: { 
                      grid: { display: false },
                      ticks: { color: "#6B7280" }
                    },
                    y: { 
                      grid: { 
                        color: "rgba(0, 0, 0, 0.1)"
                      },
                      ticks: { color: "#6B7280" },
                      beginAtZero: true 
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Reports Chart */}
          <motion.div
            className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <Activity className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Reports Activity</h3>
            </div>
            <div className="h-64">
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Reports",
                      data: reportStats,
                      borderColor: "rgb(239, 68, 68)",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      tension: 0.4,
                      pointBackgroundColor: "rgb(239, 68, 68)",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      borderColor: "rgba(239, 68, 68, 0.5)",
                      borderWidth: 1,
                    }
                  },
                  scales: {
                    x: { 
                      grid: { display: false },
                      ticks: { color: "#6B7280" }
                    },
                    y: { 
                      grid: { 
                        color: "rgba(0, 0, 0, 0.1)"
                      },
                      ticks: { color: "#6B7280" },
                      beginAtZero: true 
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalyticsPanel;
