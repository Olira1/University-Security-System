import React from "react";
import StatusBadge from "../common/StatusBadge.jsx";
import {
  UNAUTHORIZED_QR_SCAN,
  FACE_VERIFICATION_MISMATCH,
  MULTIPLE_FAIL_ATTEMPT,
  EXPIRED_VISITOR_QR_CODE,
} from "../../utils/constants.js";

/**
 * AlertCard Component
 * Card displaying a security alert/violation
 * @param {object} violation - Violation object
 * @param {function} onAcknowledge - Callback when acknowledge is clicked
 * @param {function} onInvestigate - Callback when investigate is clicked
 */
const AlertCard = ({ violation, onAcknowledge, onInvestigate }) => {
  const getViolationIcon = () => {
    switch (violation.type) {
      case UNAUTHORIZED_QR_SCAN:
      case EXPIRED_VISITOR_QR_CODE:
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case FACE_VERIFICATION_MISMATCH:
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case MULTIPLE_FAIL_ATTEMPT:
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
    }
  };

  const getViolationTitle = () => {
    switch (violation.type) {
      case UNAUTHORIZED_QR_SCAN:
        return "Unauthorized QR Code Scan";
      case FACE_VERIFICATION_MISMATCH:
        return "Face Verification Mismatch";
      case MULTIPLE_FAIL_ATTEMPT:
        return "Multiple Failed Access Attempts";
      case EXPIRED_VISITOR_QR_CODE:
        return "Expired Visitor QR Code Use";
      default:
        return "Security Violation";
    }
  };

  const getViolationDescription = () => {
    switch (violation.type) {
      case UNAUTHORIZED_QR_SCAN:
        return "An invalid QR code was attempted to be scanned at the gate. The QR code does not belong to an authorized user.";
      case FACE_VERIFICATION_MISMATCH:
        return `Face scan for user "${violation.subject?.name || "Unknown"}" at ${violation.gateName} did not match registered facial data. Manual verification required.`;
      case MULTIPLE_FAIL_ATTEMPT:
        return `User "${violation.subject?.name || "Unknown"}" attempted to access ${violation.gateName} multiple times with failed verification. Possible suspicious activity.`;
      case EXPIRED_VISITOR_QR_CODE:
        return `A visitor QR code, associated with "${violation.subject?.name || "Guest Visitor"}", was used outside its valid time window at ${violation.gateName}.`;
      default:
        return violation.message || "Security violation detected.";
    }
  };

  const getSubjectInfo = () => {
    if (!violation.subject) {
      return "Unknown Individual";
    }
    const id = violation.subject.id || "";
    const name = violation.subject.name || "Unknown";
    return `${name}${id ? ` (ID: ${id})` : ""}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    if (violation.resolved) {
      return <StatusBadge status="Acknowledged" type="violation" />;
    } else if (violation.notes) {
      return <StatusBadge status="Investigating" type="violation" />;
    } else {
      return <StatusBadge status="New" type="violation" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {getViolationIcon()}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{getViolationTitle()}</h3>
              <div className="ml-4">{getStatusBadge()}</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Type:</span>{" "}
                {violation.type === UNAUTHORIZED_QR_SCAN || violation.type === EXPIRED_VISITOR_QR_CODE
                  ? "Invalid QR"
                  : violation.type === FACE_VERIFICATION_MISMATCH
                  ? "Face Mismatch"
                  : "Failed Attempts"}
              </div>
              <div>
                <span className="font-medium">Description:</span> {getViolationDescription()}
              </div>
              <div>
                <span className="font-medium">Timestamp:</span> {formatTimestamp(violation.occurredAt)}
              </div>
              <div>
                <span className="font-medium">Location:</span> {violation.gateName || violation.gateId}
              </div>
              <div>
                <span className="font-medium">User/Vehicle:</span> {getSubjectInfo()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onAcknowledge && onAcknowledge(violation)}
          disabled={violation.resolved}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Acknowledge
        </button>
        <button
          onClick={() => onInvestigate && onInvestigate(violation)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Investigate
        </button>
      </div>
    </div>
  );
};

export default AlertCard;

