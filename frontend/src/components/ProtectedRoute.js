// ProtectedRoute Component for Authentication Guards
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({
  children,
  requireOnboarding = false,
  redirectTo = "/login",
}) => {
  const auth = useAuth();

  // Show loading while checking authentication
  if (auth.isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner
          message="Checking authentication..."
          submessage="Please wait a moment"
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!auth.isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If onboarding is required but not complete, redirect to onboarding
  if (requireOnboarding && !auth.isOnboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
