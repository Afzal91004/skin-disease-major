// Enhanced App.js with Authentication and Complete Routing
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Import Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Questionnaire from "./pages/Questionnaire";
import Diagnosis from "./pages/Diagnosis";
import Profile from "./pages/Profile";
import DiagnosisHistory from "./pages/DiagnosisHistory";

// Import Components
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Styles
import "./styles/global.css";

// Layout wrapper component
const Layout = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  // Don't show navbar on auth pages
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="app-layout">
      {!hideNavbar && auth.isAuthenticated && <Navbar />}
      <main className="main-content">{children}</main>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner
          message="Loading application..."
          submessage="Please wait while we set things up"
        />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            auth.isAuthenticated ? (
              <Navigate to="/diagnosis" replace />
            ) : (
              <Home />
            )
          }
        />

        <Route
          path="/login"
          element={
            auth.isAuthenticated ? (
              <Navigate to="/diagnosis" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            auth.isAuthenticated ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              {auth.isOnboardingComplete ? (
                <Navigate to="/questionnaire" replace />
              ) : (
                <Onboarding />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute requireOnboarding>
              <Questionnaire />
            </ProtectedRoute>
          }
        />

        <Route
          path="/diagnosis"
          element={
            <ProtectedRoute requireOnboarding>
              <Diagnosis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute requireOnboarding>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute requireOnboarding>
              <DiagnosisHistory />
            </ProtectedRoute>
          }
        />

        {/* Fallback Routes */}
        <Route
          path="/dashboard"
          element={<Navigate to="/diagnosis" replace />}
        />

        <Route path="/results" element={<Navigate to="/diagnosis" replace />} />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="error-page">
              <div className="error-content">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <button
                  onClick={() =>
                    (window.location.href = auth.isAuthenticated
                      ? "/diagnosis"
                      : "/")
                  }
                  className="btn btn--primary"
                >
                  {auth.isAuthenticated ? "Go to Diagnosis" : "Go Home"}
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
