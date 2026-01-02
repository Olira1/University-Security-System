import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";
import Header from "../../components/common/Header.jsx";
import QRScanner from "../../components/admin/QRScanner.jsx";
import CameraPreview from "../../components/admin/CameraPreview.jsx";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../context/AuthContext.jsx";

const LiveScan = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentSubject, setCurrentSubject] = useState(null);
  const [faceVerified, setFaceVerified] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleQRScanned = (response, qrCode) => {
    if (response.status === "success" && response.data.valid) {
      setCurrentSubject({
        ...response.data,
        qrCode,
      });
      setFaceVerified(false);
    }
  };

  const handleFaceVerified = () => {
    setFaceVerified(true);
  };

  const handleFaceMismatch = () => {
    setFaceVerified(false);
    // Could show error message here
  };

  const getQRCodeContent = () => {
    if (!currentSubject) return "";
    return currentSubject.qrCode || `QR-${currentSubject.subjectType.toUpperCase()}-${currentSubject.subject.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Live Scan</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Camera Preview */}
            <div className="space-y-4">
              <QRScanner onQRScanned={handleQRScanned} />
              <CameraPreview
                subject={currentSubject}
                onFaceVerified={handleFaceVerified}
                onFaceMismatch={handleFaceMismatch}
              />
            </div>

            {/* Right Side - Student/Visitor Info Card */}
            {currentSubject ? (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {currentSubject.subjectType === "student"
                    ? "Student Access QR Code"
                    : currentSubject.subjectType === "staff"
                    ? "Staff Access QR Code"
                    : "Visitor Access QR Code"}
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Details for Campus {currentSubject.subjectType}
                </p>

                {/* Subject Details */}
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      {currentSubject.subjectType === "student"
                        ? "Student Name"
                        : currentSubject.subjectType === "staff"
                        ? "Staff Name"
                        : "Visitor Name"}
                      :
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {currentSubject.subject.name}
                    </p>
                  </div>

                  {currentSubject.subject.department && (
                    <div>
                      <p className="text-sm text-gray-500">Department:</p>
                      <p className="text-base font-semibold text-gray-900 capitalize">
                        {currentSubject.subject.department}
                      </p>
                    </div>
                  )}

                  {currentSubject.subjectType === "student" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Student ID:</p>
                        <p className="text-base font-semibold text-gray-900">
                          {currentSubject.subject.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Registration Year:</p>
                        <p className="text-base font-semibold text-gray-900">
                          2024 GC-
                        </p>
                      </div>
                    </>
                  )}

                  {currentSubject.subjectType === "visitor" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Purpose of Visit:</p>
                        <p className="text-base font-semibold text-gray-900">
                          {currentSubject.subject.purpose}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Host:</p>
                        <p className="text-base font-semibold text-gray-900">
                          {currentSubject.subject.hostName}
                        </p>
                      </div>
                    </>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">Status:</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white border-2 border-purple-200 rounded-lg">
                    <QRCodeSVG
                      value={getQRCodeContent()}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>

                {/* Access ID */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">Access ID:</p>
                  <p className="text-base font-semibold text-gray-900">
                    {currentSubject.subject.id}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center justify-center min-h-[500px]">
                <div className="text-center text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <p>Scan a QR code to view details</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveScan;
