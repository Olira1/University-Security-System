import React from "react";

/**
 * StatusBadge Component
 * Displays status badges with different colors based on status type
 * @param {string} status - Status value (Granted, Denied, Active, Expired, Pending, New, Investigating, Acknowledged)
 * @param {string} type - Badge type: "access" | "violation" | "visitor"
 */
const StatusBadge = ({ status, type = "access" }) => {
  const getBadgeStyles = () => {
    const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";

    // Access status badges (Granted/Denied)
    if (type === "access") {
      switch (status?.toLowerCase()) {
        case "granted":
        case "approved":
          return `${baseStyles} bg-green-100 text-green-800`;
        case "denied":
        case "rejected":
          return `${baseStyles} bg-red-100 text-red-800`;
        default:
          return `${baseStyles} bg-gray-100 text-gray-800`;
      }
    }

    // Violation status badges (New/Investigating/Acknowledged)
    if (type === "violation") {
      switch (status?.toLowerCase()) {
        case "new":
          return `${baseStyles} bg-red-100 text-red-800`;
        case "investigating":
          return `${baseStyles} bg-purple-100 text-purple-800`;
        case "acknowledged":
        case "resolved":
          return `${baseStyles} bg-gray-100 text-gray-800`;
        default:
          return `${baseStyles} bg-gray-100 text-gray-800`;
      }
    }

    // Visitor status badges (Active/Expired/Pending)
    if (type === "visitor") {
      switch (status?.toLowerCase()) {
        case "active":
          return `${baseStyles} bg-blue-100 text-blue-800`;
        case "expired":
          return `${baseStyles} bg-purple-100 text-purple-800`;
        case "pending":
          return `${baseStyles} bg-yellow-100 text-yellow-800`;
        default:
          return `${baseStyles} bg-gray-100 text-gray-800`;
      }
    }

    // Severity badges
    if (type === "severity") {
      switch (status?.toLowerCase()) {
        case "low":
          return `${baseStyles} bg-blue-100 text-blue-800`;
        case "medium":
          return `${baseStyles} bg-yellow-100 text-yellow-800`;
        case "high":
          return `${baseStyles} bg-orange-100 text-orange-800`;
        case "critical":
          return `${baseStyles} bg-red-100 text-red-800`;
        default:
          return `${baseStyles} bg-gray-100 text-gray-800`;
      }
    }

    return `${baseStyles} bg-gray-100 text-gray-800`;
  };

  return (
    <span className={getBadgeStyles()}>
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;

