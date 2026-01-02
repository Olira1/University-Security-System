import React from "react";

/**
 * Header Component
 * Top header with user profile for admin pages
 * @param {object} user - User object with name, email, etc.
 * @param {function} onLogout - Logout handler function
 */
const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">GateFlow</h1>
        <a
          href="/police"
          className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          Police Portal
        </a>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-purple-600 font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

