// Enhanced API service with Authentication and Missing Functions
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Change to your backend URL in production

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============ AUTHENTICATION APIs ============

export const register = async (userData) => {
  try {
    const response = await api.post("/api/register", userData);

    if (response.data.success) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } else {
      throw new Error(response.data.error || "Registration failed");
    }
  } catch (error) {
    console.error("Registration Error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "Registration failed"
    );
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/api/login", credentials);

    if (response.data.success) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } else {
      throw new Error(response.data.error || "Login failed");
    }
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "Login failed"
    );
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

// ============ ONBOARDING & PROFILE APIs ============

// In api.js - make sure this function exists
export const completeOnboarding = async (onboardingData) => {
  try {
    const response = await api.post("/api/onboarding", onboardingData);
    if (response.data.success) {
      // Update user data in localStorage
      const updatedUser = { ...getCurrentUser(), is_onboarding_complete: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return response.data;
    } else {
      throw new Error(response.data.error || "Onboarding failed");
    }
  } catch (error) {
    console.error("Onboarding Error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "Onboarding failed"
    );
  }
};

export const submitQuestionnaire = async (questionnaireData) => {
  try {
    const response = await api.post("/api/questionnaire", questionnaireData);
    return response.data;
  } catch (error) {
    console.error("Questionnaire Error:", error);
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Failed to save questionnaire"
    );
  }
};

export const saveQuestionnaire = async (questionnaireData) => {
  return submitQuestionnaire(questionnaireData);
};

// Profile functions (fixed the missing ones)
export const getProfile = async () => {
  try {
    const response = await api.get("/api/profile");
    return response.data;
  } catch (error) {
    console.error("Get Profile Error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "Failed to get profile"
    );
  }
};

export const getUserProfile = getProfile; // Alias for compatibility

export const saveProfile = async (profileData) => {
  try {
    const response = await api.put("/api/profile", profileData);

    if (response.data.success) {
      // Update user data in localStorage
      const updatedUser = { ...getCurrentUser(), ...response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return response.data;
    } else {
      throw new Error(response.data.error || "Failed to update profile");
    }
  } catch (error) {
    console.error("Save Profile Error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "Failed to save profile"
    );
  }
};

export const updateUserProfile = saveProfile; // Alias for compatibility

// ============ DIAGNOSIS APIs ============

export const predictDisease = async (imageBase64, modelType = "MobileNet") => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
        model: modelType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    // Transform API response to match frontend expectations
    if (data.success) {
      return {
        prediction: data.prediction,
        confidence: data.confidence || 95,
        treatment: {
          Description: data.treatment.Description,
          Treatment: data.treatment.Treatment,
          Consult: data.treatment.Consult,
        },
        model_used: data.model_used,
        timestamp: data.timestamp,
      };
    } else {
      throw new Error(data.error || "Prediction failed");
    }
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Prediction failed: ${error.message}`);
  }
};

export const getDiagnosisHistory = async () => {
  try {
    const response = await api.get("/api/history");
    return response.data;
  } catch (error) {
    console.error("Diagnosis History Error:", error);
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Failed to get diagnosis history"
    );
  }
};

// ============ SYSTEM APIs ============

export const getPerformance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/performance`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data.success ? data.models : null;
  } catch (error) {
    console.error("Performance API Error:", error);
    return null;
  }
};

export const getModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/models`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data.success ? data.models : null;
  } catch (error) {
    console.error("Models API Error:", error);
    return null;
  }
};

export const getDiseases = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diseases`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data.success ? data.diseases : null;
  } catch (error) {
    console.error("Diseases API Error:", error);
    return null;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Health API Error:", error);
    return { success: false, error: error.message };
  }
};

// ============ UTILITY FUNCTIONS ============

export const validateImageFile = (file, maxSizeMB = 10) => {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];

  if (!validTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, GIF, and WebP images are allowed.");
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    throw new Error(`Image size must be less than ${maxSizeMB}MB.`);
  }

  return true;
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  completeOnboarding,
  submitQuestionnaire,
  saveQuestionnaire,
  getProfile,
  getUserProfile,
  saveProfile,
  updateUserProfile,
  predictDisease,
  getDiagnosisHistory,
  getPerformance,
  getModels,
  getDiseases,
  checkHealth,
  validateImageFile,
  convertFileToBase64,
};
