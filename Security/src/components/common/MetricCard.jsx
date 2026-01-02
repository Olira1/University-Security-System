import React from "react";

/**
 * MetricCard Component
 * Displays dashboard metrics with percentage changes
 * @param {string} title - Metric title
 * @param {number} value - Metric value
 * @param {number} change - Percentage change
 * @param {string} changeType - "increase" | "decrease" | "neutral"
 * @param {React.Component} icon - Icon component
 */
const MetricCard = ({ title, value, change, changeType = "neutral", icon: Icon }) => {
  const formatValue = (val) => {
    return val.toLocaleString();
  };

  const getChangeColor = () => {
    if (changeType === "increase") return "text-green-600";
    if (changeType === "decrease") return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = () => {
    if (changeType === "increase") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      );
    }
    if (changeType === "decrease") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      );
    }
    return (
      <span className="w-4 h-4 flex items-center justify-center">-</span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        {Icon && (
          <div className="text-purple-600">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
        </div>
        <div className={`flex items-center gap-1 ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="text-sm font-medium">
            {changeType !== "neutral" ? `${change > 0 ? "+" : ""}${change.toFixed(1)}%` : `${change.toFixed(1)}%`} daily
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;

