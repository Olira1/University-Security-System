import React, { useEffect } from "react";
import {
  UNAUTHORIZED_QR_SCAN,
  FACE_VERIFICATION_MISMATCH,
  MULTIPLE_FAIL_ATTEMPT,
  EXPIRED_VISITOR_QR_CODE,
} from "../../utils/constants.js";

/**
 * AlertDisplay Component
 * Full-screen alert modal for police portal
 * @param {object} violation - Violation object
 * @param {function} onClose - Callback to close alert
 * @param {number} autoCloseDelay - Auto-close delay in milliseconds (default: 5000)
 */
const AlertDisplay = ({ violation, onClose, autoCloseDelay = 5000 }) => {
  useEffect(() => {
    if (violation && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [violation, autoCloseDelay, onClose]);

  if (!violation) return null;

  const getViolationTitle = () => {
    switch (violation.type) {
      case UNAUTHORIZED_QR_SCAN:
        return "Unauthorized QR Scan";
      case FACE_VERIFICATION_MISMATCH:
        return "Face Verification Mismatch";
      case MULTIPLE_FAIL_ATTEMPT:
        return "Multiple Failed Attempts";
      case EXPIRED_VISITOR_QR_CODE:
        return "Expired Visitor Pass";
      default:
        return "Security Violation";
    }
  };

  const getSeverityColor = () => {
    switch (violation.severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-600";
      case "medium":
        return "bg-yellow-600";
      case "low":
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${getSeverityColor()} text-white p-6 rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h2 className="text-2xl font-bold">{getViolationTitle()}</h2>
                <p className="text-sm opacity-90">Security Alert</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Violation Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Violation Type</p>
              <p className="text-lg font-semibold text-gray-900">
                {violation.type}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Severity</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {violation.severity || "high"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gate</p>
              <p className="text-lg font-semibold text-gray-900">
                {violation.gateName || violation.gateId}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(violation.occurredAt)}
              </p>
            </div>
          </div>

          {/* Subject Information */}
          {violation.subject ? (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Subject Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-base text-gray-900">{violation.subject.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-base text-gray-900 capitalize">
                    {violation.subjectType || violation.subject.type}
                  </p>
                </div>
                {violation.subject.id && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID</p>
                    <p className="text-base text-gray-900">{violation.subject.id}</p>
                  </div>
                )}
              </div>
              {violation.subject.photoUrl && (
                <div className="mt-4">
                  <img
                    src={violation.subject.photoUrl}
                    alt={violation.subject.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Subject Information
              </h3>
              <p className="text-gray-600">
                Unknown individual - QR code could not be linked to any subject
              </p>
            </div>
          )}

          {/* Additional Details */}
          {violation.details && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Additional Details
              </h3>
              {violation.details.confidence !== undefined && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Confidence:</span>{" "}
                  {(violation.details.confidence * 100).toFixed(1)}%
                </p>
              )}
              {violation.details.failedAttemptCount && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Failed Attempts:</span>{" "}
                  {violation.details.failedAttemptCount}
                </p>
              )}
              {violation.details.lockoutUntil && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Lockout Until:</span>{" "}
                  {formatDate(violation.details.lockoutUntil)}
                </p>
              )}
              {violation.details.capturedImageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Captured Image
                  </p>
                  <img
                    src={violation.details.capturedImageUrl}
                    alt="Captured"
                    className="w-full max-w-md rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Message */}
          {violation.message && (
            <div className="border-t pt-4">
              <p className="text-gray-700">{violation.message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDisplay;

