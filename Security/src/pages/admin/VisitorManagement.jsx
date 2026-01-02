import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";
import Header from "../../components/common/Header.jsx";
import VisitorForm from "../../components/admin/VisitorForm.jsx";
import QRCodeDisplay from "../../components/admin/QRCodeDisplay.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { MOCK_VISITORS } from "../../utils/mockData.js";

const VisitorManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState(MOCK_VISITORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatedPass, setGeneratedPass] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleVisitorCreated = (visitorPass) => {
    setGeneratedPass(visitorPass);
    // Add to visitors list
    const newVisitor = {
      id: visitorPass.passId,
      name: visitorPass.visitorName,
      photoUrl: null,
      purpose: visitorPass.purpose,
      hostName: visitorPass.host.name,
      hostDepartment: visitorPass.host.department,
      validFrom: visitorPass.validFrom,
      validUntil: visitorPass.validUntil,
    };
    setVisitors([newVisitor, ...visitors]);
  };

  const handleError = (error) => {
    console.error("Error creating visitor pass:", error);
  };

  const getVisitorStatus = (visitor) => {
    const now = new Date();
    const validFrom = new Date(visitor.validFrom);
    const validUntil = new Date(visitor.validUntil);

    if (now < validFrom) {
      return "Pending";
    } else if (now > validUntil) {
      return "Expired";
    } else {
      return "Active";
    }
  };

  const formatDateRange = (from, until) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    return `${formatDate(from)} - ${formatDate(until)}`;
  };

  const filteredVisitors = visitors.filter((visitor) =>
    visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visitor.hostName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Visitor Management</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card - Create Visitor QR */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create Visitor QR</h2>
              <VisitorForm onSuccess={handleVisitorCreated} onError={handleError} />
            </div>

            {/* Right Card - Current Visitors */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Visitors</h2>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search visitors..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Visitors Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Visitor</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Host</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Access Period</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500">
                          No visitors found
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map((visitor) => (
                        <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{visitor.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{visitor.hostName}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {formatDateRange(visitor.validFrom, visitor.validUntil)}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              status={getVisitorStatus(visitor)}
                              type="visitor"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  // Find the visitor pass data
                                  const pass = {
                                    passId: visitor.id,
                                    visitorName: visitor.name,
                                    purpose: visitor.purpose,
                                    validFrom: visitor.validFrom,
                                    validUntil: visitor.validUntil,
                                    qrCode: {
                                      content: `QR-VIS-2026-${visitor.id}`,
                                    },
                                  };
                                  setGeneratedPass(pass);
                                }}
                                className="text-sm text-gray-700 hover:text-purple-600"
                              >
                                View QR
                              </button>
                              <button className="text-sm text-red-600 hover:text-red-800">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* QR Code Display Modal */}
          {generatedPass && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative">
                <button
                  onClick={() => setGeneratedPass(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <QRCodeDisplay visitorPass={generatedPass} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VisitorManagement;
