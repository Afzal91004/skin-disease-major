// Authentication Context for Managing User State
import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getCurrentUser,
  isAuthenticated,
  logout as logoutAPI,
} from "../services/api";

// Create context
const AuthContext = createContext();

// Auth states
const authStates = {
  LOADING: "LOADING",
  AUTHENTICATED: "AUTHENTICATED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  ERROR: "ERROR",
};

// Initial state
const initialState = {
  status: authStates.LOADING,
  user: null,
  error: null,
  isOnboardingComplete: false,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, status: authStates.LOADING, error: null };

    case "SET_AUTHENTICATED":
      return {
        ...state,
        status: authStates.AUTHENTICATED,
        user: action.payload.user,
        isOnboardingComplete:
          action.payload.user?.is_onboarding_complete || false,
        error: null,
      };

    case "SET_UNAUTHENTICATED":
      return {
        ...state,
        status: authStates.UNAUTHENTICATED,
        user: null,
        isOnboardingComplete: false,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        status: authStates.ERROR,
        error: action.payload.error,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isOnboardingComplete:
          action.payload.is_onboarding_complete || state.isOnboardingComplete,
      };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        if (isAuthenticated()) {
          const user = getCurrentUser();
          if (user) {
            dispatch({
              type: "SET_AUTHENTICATED",
              payload: { user },
            });
          } else {
            dispatch({ type: "SET_UNAUTHENTICATED" });
          }
        } else {
          dispatch({ type: "SET_UNAUTHENTICATED" });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        dispatch({
          type: "SET_ERROR",
          payload: { error: "Failed to check authentication status" },
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Action creators
  const login = (userData) => {
    dispatch({
      type: "SET_AUTHENTICATED",
      payload: { user: userData.user },
    });
  };

  const logout = () => {
    logoutAPI();
    dispatch({ type: "SET_UNAUTHENTICATED" });
  };

  const updateUser = (userData) => {
    // Update localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    dispatch({
      type: "UPDATE_USER",
      payload: userData,
    });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };

  const setError = (error) => {
    dispatch({
      type: "SET_ERROR",
      payload: { error },
    });
  };

  const value = {
    // State
    status: state.status,
    user: state.user,
    error: state.error,
    isOnboardingComplete: state.isOnboardingComplete,

    // Computed values
    isLoading: state.status === authStates.LOADING,
    isAuthenticated: state.status === authStates.AUTHENTICATED,
    isUnauthenticated: state.status === authStates.UNAUTHENTICATED,
    hasError: state.status === authStates.ERROR,

    // Actions
    login,
    logout,
    updateUser,
    clearError,
    setLoading,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// Higher-order component for protected routes
export const withAuth = (Component) => {
  return (props) => {
    const auth = useAuth();

    if (auth.isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="loading-spinner">Loading...</div>
        </div>
      );
    }

    if (auth.isUnauthenticated) {
      window.location.href = "/login";
      return null;
    }

    return <Component {...props} auth={auth} />;
  };
};

export default AuthContext;
