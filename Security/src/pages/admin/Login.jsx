import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoginForm from "../../components/auth/LoginForm.jsx";

/**
 * Login Page
 * Admin portal login page
 */
const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">GateFlow</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to access the admin portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <LoginForm />
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Demo: Use <span className="font-mono font-semibold">EMP-2024-001</span> / <span className="font-mono font-semibold">password123</span>
          </p>
          <a
            href="/police"
            className="text-sm text-purple-600 hover:text-purple-800 underline"
          >
            Go to Police Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

