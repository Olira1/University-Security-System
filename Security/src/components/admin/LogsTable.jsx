import React from "react";
import StatusBadge from "../common/StatusBadge.jsx";

/**
 * LogsTable Component
 * Table displaying violation logs
 * @param {array} violations - Array of violation objects
 * @param {object} pagination - Pagination object
 * @param {function} onPageChange - Callback for page changes
 */
const LogsTable = ({ violations, pagination, onPageChange }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getViolationTypeLabel = (type) => {
    switch (type) {
      case "unauthorized_qr_scan":
        return "Unauthorized QR";
      case "face_verification_mismatch":
        return "Face Mismatch";
      case "multiple_fail_attempt":
        return "Multiple Failures";
      case "expired_visitor_qr_code":
        return "Expired Visitor";
      default:
        return type;
    }
  };

  const getSubjectName = (violation) => {
    if (!violation.subject) {
      return "Unknown Individual";
    }
    return violation.subject.name || "Unknown";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Timestamp</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Violation Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Subject Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Subject Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Gate</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {violations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No violations found
                </td>
              </tr>
            ) : (
              violations.map((violation) => (
                <tr key={violation.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {formatTimestamp(violation.occurredAt)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {getViolationTypeLabel(violation.type)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 capitalize">
                    {violation.subjectType || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {getSubjectName(violation)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {violation.gateName || violation.gateId}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={violation.resolved ? "Acknowledged" : "New"}
                      type="violation"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => onPageChange && onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className="px-4 py-2 text-sm text-gray-700 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt; Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange && onPageChange(page)}
                className={`px-3 py-1 text-sm rounded ${
                  page === pagination.currentPage
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange && onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 text-sm text-gray-700 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default LogsTable;

