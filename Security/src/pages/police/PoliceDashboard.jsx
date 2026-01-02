import React, { useState, useEffect } from "react";
import QRScanner from "../../components/police/QRScanner.jsx";
import CameraPreview from "../../components/police/CameraPreview.jsx";
import AlertDisplay from "../../components/police/AlertDisplay.jsx";
import { useAlert } from "../../context/AlertContext.jsx";
import {
  UNAUTHORIZED_QR_SCAN,
  FACE_VERIFICATION_MISMATCH,
  MULTIPLE_FAIL_ATTEMPT,
  EXPIRED_VISITOR_QR_CODE,
} from "../../utils/constants.js";

/**
 * PoliceDashboard Page
 * Full-screen scanning interface for police portal
 */
const PoliceDashboard = () => {
  const [currentSubject, setCurrentSubject] = useState(null);
  const [showWhiteScreen, setShowWhiteScreen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const { violations, getUnresolvedViolations } = useAlert();

  // Listen for new violations from WebSocket
  useEffect(() => {
    const unresolved = getUnresolvedViolations();
    if (unresolved.length > 0) {
      // Show the most recent unresolved violation
      const latestViolation = unresolved[0];
      setCurrentAlert(latestViolation);
      setShowWhiteScreen(false);
      setCurrentSubject(null);
    }
  }, [violations, getUnresolvedViolations]);

  const handleQRScanned = (response, qrCode) => {
    if (response.status === "success" && response.data.valid) {
      // Valid QR code - set subject for face verification
      setCurrentSubject({
        ...response.data,
        qrCode,
      });
      setShowWhiteScreen(false);
      setCurrentAlert(null);
    } else {
      // Invalid QR or violation
      const violation = {
        type: response.data.violationType,
        violationId: response.data.violationId,
        gateId: "gate_main_entrance",
        gateName: "Main Entrance Gate",
        occurredAt: new Date().toISOString(),
        subject: response.data.subject || null,
        subjectType: response.data.subject?.type || null,
        severity: "high",
        message: response.data.message,
        details: {
          scannedQrCode: qrCode,
        },
      };
      setCurrentAlert(violation);
      setShowWhiteScreen(false);
      setCurrentSubject(null);
    }
  };

  const handleFaceVerified = (verificationData) => {
    // Success - show white screen
    setShowWhiteScreen(true);
    setCurrentAlert(null);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowWhiteScreen(false);
      setCurrentSubject(null);
    }, 3000);
  };

  const handleFaceMismatch = (verificationData) => {
    // Face mismatch - create violation alert
    const violation = {
      type: verificationData.violationType,
      violationId: verificationData.violationId,
      gateId: "gate_main_entrance",
      gateName: "Main Entrance Gate",
      occurredAt: new Date().toISOString(),
      subject: verificationData.subject,
      subjectType: verificationData.subject?.type || null,
      severity:
        verificationData.violationType === MULTIPLE_FAIL_ATTEMPT
          ? "critical"
          : "high",
      message: verificationData.message,
      details: {
        confidence: verificationData.confidence,
        ...(verificationData.lockoutUntil && {
          lockoutUntil: verificationData.lockoutUntil,
          failedAttemptCount: verificationData.failedAttemptCount,
        }),
      },
    };
    setCurrentAlert(violation);
    setShowWhiteScreen(false);
  };

  const handleAlertClose = () => {
    setCurrentAlert(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    // Could show error alert here
  };

  // White screen state (success)
  if (showWhiteScreen) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto mb-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Access Granted
          </h2>
          <p className="text-gray-600">Face verification successful</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Alert Overlay */}
      {currentAlert && (
        <AlertDisplay violation={currentAlert} onClose={handleAlertClose} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Police Portal - Gate Scanner
            </h1>
            <p className="text-gray-600 mt-2">
              Scan QR codes and verify faces for campus access
            </p>
          </div>
          <a
            href="/admin/login"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Portal
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <QRScanner onQRScanned={handleQRScanned} onError={handleError} />

          {/* Camera Preview */}
          <CameraPreview
            subject={currentSubject}
            onFaceVerified={handleFaceVerified}
            onFaceMismatch={handleFaceMismatch}
          />
        </div>

        {/* Current Subject Info */}
        {currentSubject && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current Subject
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-base font-medium text-gray-900">
                  {currentSubject.subject.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {currentSubject.subjectType}
                </p>
              </div>
              {currentSubject.subject.department && (
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="text-base font-medium text-gray-900">
                    {currentSubject.subject.department}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceDashboard;

