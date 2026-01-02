import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, getMe } from "../services/apiMock.js";

const AuthContext = createContext(null);

/**
 * AuthContext Provider
 * Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login function
   * @param {string} employeeId - Employee ID
   * @param {string} password - Password
   * @param {boolean} rememberMe - Remember me option
   * @returns {Promise<object>} Login result
   */
  const login = async (employeeId, password, rememberMe = false) => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/63f021bc-fe02-4570-9406-864c4dc43516", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "AuthContext.jsx:login",
        message: "AuthContext login called",
        data: { employeeId, passwordLength: password?.length, rememberMe },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion
    try {
      const response = await apiLogin(employeeId, password);

      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/63f021bc-fe02-4570-9406-864c4dc43516",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "AuthContext.jsx:login:response",
            message: "API response received",
            data: {
              status: response.status,
              code: response.code,
              hasData: !!response.data,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "E",
          }),
        }
      ).catch(() => {});
      // #endregion

      if (response.status === "error") {
        return {
          success: false,
          error: response.code,
          message: response.message,
        };
      }

      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);

      // Store in localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }

      return {
        success: true,
        user: userData,
        token: newToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "INTERNAL_ERROR",
        message: "An error occurred during login",
      };
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  /**
   * Get current user
   * @returns {object|null}
   */
  const getCurrentUser = () => {
    return user;
  };

  /**
   * Get current token
   * @returns {string|null}
   */
  const getToken = () => {
    return token;
  };

  /**
   * Refresh user data from API
   */
  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await getMe(token);
      if (response.status === "success") {
        setUser(response.data);
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          localStorage.setItem("auth_user", JSON.stringify(response.data));
        }
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    getToken,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use AuthContext
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
