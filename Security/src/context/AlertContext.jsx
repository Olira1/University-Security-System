import React, { createContext, useContext, useState, useEffect } from "react";
import wsMock from "../services/wsMock.js";
import { getViolations } from "../services/apiMock.js";

const AlertContext = createContext(null);

/**
 * AlertContext Provider
 * Manages violation alerts and provides alert methods
 */
export const AlertProvider = ({ children }) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Get token from localStorage (works independently of AuthContext)
  const getToken = () => {
    return localStorage.getItem("auth_token");
  };

  // Connect to WebSocket on mount
  useEffect(() => {
    try {
      wsMock.connect();

      // Subscribe to WebSocket alerts
      const handleAlert = (message) => {
        if (message.type === "violation_alert") {
          // Add new violation to state
          const newViolation = {
            id: message.data.violationId,
            type: message.data.violationType,
            subjectType: message.data.subject?.type || null,
            subject: message.data.subject || null,
            gateId: message.data.gate.id,
            gateName: message.data.gate.name,
            occurredAt: message.timestamp,
            details: {
              ...(message.data.confidence && { confidence: message.data.confidence }),
              ...(message.data.lockoutUntil && {
                lockoutUntil: message.data.lockoutUntil,
                failedAttemptCount: message.data.failedAttemptCount,
              }),
              capturedImageUrl: message.data.capturedImageUrl,
            },
            resolved: false,
            resolvedAt: null,
            resolvedBy: null,
            notes: null,
            severity: message.data.severity || "high",
          };

          setViolations((prev) => [newViolation, ...prev]);
        }
      };

      wsMock.subscribe(handleAlert);

      // Cleanup on unmount
      return () => {
        wsMock.unsubscribe(handleAlert);
        wsMock.disconnect();
      };
    } catch (error) {
      console.error("Error initializing AlertContext:", error);
    }
  }, []);

  /**
   * Fetch violations from API
   * @param {object} filters - Filter parameters
   * @returns {Promise<object>} Violations response
   */
  const fetchViolations = async (filters = {}) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await getViolations(filters, token);

      if (response.status === "success") {
        setViolations(response.data.violations);
        return {
          success: true,
          violations: response.data.violations,
          pagination: response.data.pagination,
        };
      } else {
        return {
          success: false,
          error: response.code,
          message: response.message,
        };
      }
    } catch (error) {
      console.error("Error fetching violations:", error);
      return {
        success: false,
        error: "INTERNAL_ERROR",
        message: "An error occurred while fetching violations",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add violation manually (for testing or manual entry)
   * @param {object} violation - Violation object
   */
  const addViolation = (violation) => {
    setViolations((prev) => [violation, ...prev]);
  };

  /**
   * Acknowledge/resolve a violation
   * @param {string} violationId - Violation ID
   * @param {object} resolvedBy - User who resolved it
   * @param {string} notes - Resolution notes
   */
  const acknowledgeViolation = (violationId, resolvedBy, notes = null) => {
    setViolations((prev) =>
      prev.map((v) =>
        v.id === violationId
          ? {
              ...v,
              resolved: true,
              resolvedAt: new Date().toISOString(),
              resolvedBy,
              notes,
            }
          : v
      )
    );
  };

  /**
   * Get violations by type
   * @param {string} type - Violation type
   * @returns {array} Filtered violations
   */
  const getViolationsByType = (type) => {
    return violations.filter((v) => v.type === type);
  };

  /**
   * Get unresolved violations
   * @returns {array} Unresolved violations
   */
  const getUnresolvedViolations = () => {
    return violations.filter((v) => !v.resolved);
  };

  /**
   * Get violations by severity
   * @param {string} severity - Severity level
   * @returns {array} Filtered violations
   */
  const getViolationsBySeverity = (severity) => {
    return violations.filter((v) => v.severity === severity);
  };

  /**
   * Clear all violations (for testing)
   */
  const clearViolations = () => {
    setViolations([]);
  };

  const value = {
    violations,
    loading,
    fetchViolations,
    addViolation,
    acknowledgeViolation,
    getViolationsByType,
    getUnresolvedViolations,
    getViolationsBySeverity,
    clearViolations,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

/**
 * Hook to use AlertContext
 * @returns {object} Alert context value
 */
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export default AlertContext;

