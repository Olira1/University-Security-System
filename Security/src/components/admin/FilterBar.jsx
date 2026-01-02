import React from "react";
import {
  UNAUTHORIZED_QR_SCAN,
  FACE_VERIFICATION_MISMATCH,
  MULTIPLE_FAIL_ATTEMPT,
  EXPIRED_VISITOR_QR_CODE,
  SUBJECT_STUDENT,
  SUBJECT_STAFF,
  SUBJECT_VISITOR,
} from "../../utils/constants.js";
import { MOCK_GATES } from "../../utils/mockData.js";

/**
 * FilterBar Component
 * Filter and search bar for scan logs
 * @param {object} filters - Current filter values
 * @param {function} onFilterChange - Callback when filters change
 * @param {function} onExport - Callback for export action
 */
const FilterBar = ({ filters, onFilterChange, onExport }) => {
  const handleChange = (name, value) => {
    if (onFilterChange) {
      onFilterChange({ ...filters, [name]: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter and Search Logs</h3>
      <p className="text-sm text-gray-600 mb-4">
        Refine your search for access events by various criteria.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
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
              value={filters.search || ""}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder="Search by user or scan ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Date Picker */}
        <div>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              type="date"
              value={filters.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
              placeholder="Pick a date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Violation Type Filter */}
        <div>
          <select
            value={filters.type || ""}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
          >
            <option value="">All Violation Types</option>
            <option value={UNAUTHORIZED_QR_SCAN}>Unauthorized QR Scan</option>
            <option value={FACE_VERIFICATION_MISMATCH}>Face Verification Mismatch</option>
            <option value={MULTIPLE_FAIL_ATTEMPT}>Multiple Failed Attempts</option>
            <option value={EXPIRED_VISITOR_QR_CODE}>Expired Visitor QR Code</option>
          </select>
        </div>

        {/* Export Button */}
        <div>
          <button
            onClick={onExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

