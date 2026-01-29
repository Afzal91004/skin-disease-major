// Enhanced Navbar Component with User Management
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md border-b border-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/diagnosis" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-textPrimary group-hover:text-primary transition-colors duration-200">
                <span className="text-primary">SkinVista</span> AI
              </span>
              <span className="text-xs text-textSecondary -mt-1">
                Advanced Dermatology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/diagnosis"
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/diagnosis")
                  ? "bg-primary text-white shadow-md"
                  : "text-textSecondary hover:text-primary hover:bg-primary/5"
              }`}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Diagnosis
            </Link>

            <Link
              to="/history"
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/history")
                  ? "bg-primary text-white shadow-md"
                  : "text-textSecondary hover:text-primary hover:bg-primary/5"
              }`}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6.5A2.5 2.5 0 017.5 14H7a2 2 0 01-2-2V5zm8 0a2 2 0 012 2v7a2 2 0 01-2 2H6.82a2.5 2.5 0 001.18-2.118V5z"
                  clipRule="evenodd"
                />
              </svg>
              History
            </Link>

            <Link
              to="/questionnaire"
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/questionnaire")
                  ? "bg-primary text-white shadow-md"
                  : "text-textSecondary hover:text-primary hover:bg-primary/5"
              }`}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Questionnaire
            </Link>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {auth.user?.first_name?.[0]?.toUpperCase() || (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-textPrimary">
                  {auth.user?.first_name || "User"}
                </div>
                <div className="text-xs text-textSecondary">
                  {auth.user?.email?.length > 20
                    ? `${auth.user.email.substring(0, 20)}...`
                    : auth.user?.email || "user@email.com"}
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-textSecondary transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-surface py-2 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-surface">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                      {auth.user?.first_name?.[0]?.toUpperCase() || (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-textPrimary truncate">
                        {auth.user?.first_name} {auth.user?.last_name}
                      </div>
                      <div className="text-sm text-textSecondary truncate">
                        {auth.user?.email}
                      </div>
                      <div className="text-xs text-success font-medium mt-1">
                        Active Account
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-textPrimary hover:bg-surface transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Profile Settings</div>
                      <div className="text-xs text-textSecondary">
                        Manage your account
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/history"
                    className="flex items-center px-4 py-3 text-sm text-textPrimary hover:bg-surface transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-secondary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6.5A2.5 2.5 0 017.5 14H7a2 2 0 01-2-2V5zm8 0a2 2 0 012 2v7a2 2 0 01-2 2H6.82a2.5 2.5 0 001.18-2.118V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Diagnosis History</div>
                      <div className="text-xs text-textSecondary">
                        View past analyses
                      </div>
                    </div>
                  </Link>

                  <div className="border-t border-surface my-2"></div>

                  <button
                    className="w-full flex items-center px-4 py-3 text-sm text-error hover:bg-error/5 transition-colors duration-150"
                    onClick={handleLogout}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Sign Out</div>
                      <div className="text-xs text-textSecondary">
                        End your session
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span
                className={`w-full h-0.5 bg-textPrimary transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-textPrimary transition-opacity duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-textPrimary transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-surface shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/diagnosis"
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/diagnosis")
                  ? "bg-primary text-white shadow-md"
                  : "text-textSecondary hover:text-primary hover:bg-primary/5"
              }`}
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Diagnosis
            </Link>

            <Link
              to="/history"
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/history")
                  ? "bg-primary text-white shadow-md"
                  : "text-textSecondary hover:text-primary hover:bg-primary/5"
              }`}
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6.5A2.5 2.5 0 017.5 14H7a2 2 0 01-2-2V5zm8 0a2 2 0 012 2v7a2 2 0 01-2 2H6.82a2.5 2.5 0 001.18-2.118V5z"
                  clipRule="evenodd"
                />
              </svg>
              History
            </Link>

            <Link
              to="/questionnaire"
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/questionnaire")
                  ? "bg-primary text-white shadow-md"
                  : "text-textSecondary hover:text-primary hover:bg-primary/5"
              }`}
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Questionnaire
            </Link>

            <Link
              to="/profile"
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath("/profile")
                  ? "bg-primary text-white shadow-md"
                  : "text-textSecondary hover:text-primary hover:bg-primary/5"
              }`}
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Profile
            </Link>

            <div className="border-t border-surface my-4"></div>

            <button
              className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/5 transition-all duration-200"
              onClick={handleLogout}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
