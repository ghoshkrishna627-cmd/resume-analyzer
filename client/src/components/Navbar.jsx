// ============================================================
// components/Navbar.jsx - Top Navigation Bar
// ============================================================

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ink-800 bg-ink-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-acid-400 flex items-center justify-center">
            <svg className="w-5 h-5 text-ink-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-display font-800 text-lg tracking-tight">
            Resume<span className="text-acid-400">AI</span>
          </span>
        </Link>

        {/* Nav Links + Auth */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/"
                className={`text-sm font-display transition-colors ${
                  isActive("/") ? "text-acid-400" : "text-ink-400 hover:text-ink-200"
                }`}
              >
                Analyze
              </Link>
              <Link
                to="/history"
                className={`text-sm font-display transition-colors ${
                  isActive("/history") ? "text-acid-400" : "text-ink-400 hover:text-ink-200"
                }`}
              >
                History
              </Link>

              {/* User info */}
              <div className="flex items-center gap-3 pl-4 border-l border-ink-800">
                <div className="w-8 h-8 rounded-full bg-ink-800 flex items-center justify-center">
                  <span className="text-xs font-display text-acid-400 font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-ink-300 hidden sm:block">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-ink-500 hover:text-ink-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-display text-ink-400 hover:text-ink-200 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm btn-primary py-2 px-4"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
