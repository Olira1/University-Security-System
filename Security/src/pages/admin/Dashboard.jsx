import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";
import Header from "../../components/common/Header.jsx";
import MetricCard from "../../components/common/MetricCard.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getDashboardStats } from "../../services/apiMock.js";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await getDashboardStats(token);
        if (response.status === "success") {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Icon components
  const PersonIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const CarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );

  const BuildingIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 h-32 animate-pulse"></div>
                <div className="bg-white rounded-lg shadow-md p-6 h-32 animate-pulse"></div>
                <div className="bg-white rounded-lg shadow-md p-6 h-32 animate-pulse"></div>
              </>
            ) : stats ? (
              <>
                <MetricCard
                  title="Total Entries"
                  value={stats.totalEntries}
                  change={stats.entriesChange}
                  changeType={stats.entriesChange > 0 ? "increase" : stats.entriesChange < 0 ? "decrease" : "neutral"}
                  icon={PersonIcon}
                />
                <MetricCard
                  title="Total Vehicles"
                  value={stats.totalVehicles}
                  change={stats.vehiclesChange}
                  changeType={stats.vehiclesChange > 0 ? "increase" : stats.vehiclesChange < 0 ? "decrease" : "neutral"}
                  icon={CarIcon}
                />
                <MetricCard
                  title="Total Visitors"
                  value={stats.totalVisitors}
                  change={stats.visitorsChange}
                  changeType={stats.visitorsChange > 0 ? "increase" : stats.visitorsChange < 0 ? "decrease" : "neutral"}
                  icon={BuildingIcon}
                />
              </>
            ) : null}
          </div>

          {/* Recent Live Scans */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Live Scans</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Event</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Identity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : stats?.recentScans ? (
                    stats.recentScans.map((scan, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{scan.time}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{scan.event}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{scan.identity}</td>
                        <td className="py-3 px-4">
                          <StatusBadge
                            status={scan.status}
                            type="access"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">No recent scans</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/admin/visitor-management")}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                + Add New Visitor
              </button>
              <button
                onClick={() => navigate("/admin/alerts")}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                View All Alerts
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Monitor Vehicles
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
