import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";
import Header from "../../components/common/Header.jsx";
import AlertCard from "../../components/admin/AlertCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";

const Alerts = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { violations, fetchViolations, acknowledgeViolation } = useAlert();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = async () => {
    setLoading(true);
    await fetchViolations({ resolved: false }); // Get unresolved violations
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleAcknowledge = async (violation) => {
    const token = localStorage.getItem("auth_token");
    const resolvedBy = {
      id: user?.id || "usr_abc123",
      name: user?.name || "System",
    };
    
    acknowledgeViolation(violation.id, resolvedBy, "Acknowledged by admin");
    // Reload violations
    await loadViolations();
  };

  const handleInvestigate = (violation) => {
    // Navigate to scan logs with filter for this violation
    navigate(`/admin/scan-logs?violationId=${violation.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Alerts</h1>
            <p className="text-gray-600">
              Monitor and manage security incidents, unauthorized access attempts, and verification discrepancies across all gates.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : violations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 text-lg">No active alerts</p>
              <p className="text-gray-500 text-sm mt-2">All security alerts have been resolved.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {violations.map((violation) => (
                <AlertCard
                  key={violation.id}
                  violation={violation}
                  onAcknowledge={handleAcknowledge}
                  onInvestigate={handleInvestigate}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Alerts;
