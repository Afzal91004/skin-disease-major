// Enhanced Profile Page Component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  getDiagnosisHistory,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'history'
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    emergency_contact: "",
    medical_history: [],
    allergies: "",
    current_medications: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);

      // Load user profile
      const profileData = await getUserProfile();
      if (profileData) {
        setUser(profileData);
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          email: profileData.email || "",
          age: profileData.age || "",
          gender: profileData.gender || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          emergency_contact: profileData.emergency_contact || "",
          medical_history: profileData.medical_history || [],
          allergies: profileData.allergies || "",
          current_medications: profileData.current_medications || "",
        });
      }

      // Load diagnosis history
      const historyData = await getDiagnosisHistory();
      if (historyData && Array.isArray(historyData.history)) {
        setDiagnosisHistory(historyData.history);
      } else {
        setDiagnosisHistory([]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setErrors({ load: "Failed to load profile data" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "medical_history") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = "Please enter a valid age";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      setErrors({ success: "Profile updated successfully!" });
    } catch (error) {
      setErrors({ save: error.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original user data
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        age: user.age || "",
        gender: user.gender || "",
        phone: user.phone || "",
        address: user.address || "",
        emergency_contact: user.emergency_contact || "",
        medical_history: user.medical_history || [],
        allergies: user.allergies || "",
        current_medications: user.current_medications || "",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "text-success";
    if (confidence >= 70) return "text-warning";
    return "text-error";
  };

  const getConfidenceBgColor = (confidence) => {
    if (confidence >= 90) return "bg-success/10 border-success/20";
    if (confidence >= 70) return "bg-warning/10 border-warning/20";
    return "bg-error/10 border-error/20";
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message="Loading your profile..."
        submessage="Please wait while we fetch your data"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md border border-surface mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.first_name?.[0]?.toUpperCase() || (
                    <svg
                      className="w-12 h-12"
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
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-white flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-textPrimary mb-2">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-textSecondary mb-2 flex items-center justify-center sm:justify-start">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {user?.email}
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-textSecondary">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Member since{" "}
                    {user?.created_at ? formatDate(user.created_at) : "Unknown"}
                  </span>
                  <span className="flex items-center px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-success rounded-full mr-1 animate-pulse"></div>
                    Active
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-md border border-surface mb-8 overflow-hidden">
          <div className="flex border-b border-surface">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 flex items-center justify-center ${
                activeTab === "profile"
                  ? "text-primary bg-primary/5 border-b-2 border-primary"
                  : "text-textSecondary hover:text-textPrimary hover:bg-surface/50"
              }`}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 flex items-center justify-center ${
                activeTab === "history"
                  ? "text-primary bg-primary/5 border-b-2 border-primary"
                  : "text-textSecondary hover:text-textPrimary hover:bg-surface/50"
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
              Diagnosis History
              <span className="ml-2 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold">
                {diagnosisHistory.length}
              </span>
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {errors.success && (
          <div className="mb-8 bg-success/5 border border-success/20 rounded-2xl p-4">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-success mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-success font-medium">{errors.success}</span>
            </div>
          </div>
        )}

        {(errors.load || errors.save) && (
          <div className="mb-8 bg-error/5 border border-error/20 rounded-2xl p-4">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-error mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-error font-medium">
                {errors.load || errors.save}
              </span>
            </div>
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-md border border-surface overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-surface">
                <h3 className="text-lg font-semibold text-textPrimary flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Personal Information
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      First Name <span className="text-error">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                          errors.first_name ? "border-error" : "border-surface"
                        }`}
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary">
                        {user?.first_name || "Not provided"}
                      </div>
                    )}
                    {errors.first_name && (
                      <p className="text-error text-sm mt-1">
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Last Name <span className="text-error">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                          errors.last_name ? "border-error" : "border-surface"
                        }`}
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary">
                        {user?.last_name || "Not provided"}
                      </div>
                    )}
                    {errors.last_name && (
                      <p className="text-error text-sm mt-1">
                        {errors.last_name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Email <span className="text-error">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                          errors.email ? "border-error" : "border-surface"
                        }`}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary">
                        {user?.email || "Not provided"}
                      </div>
                    )}
                    {errors.email && (
                      <p className="text-error text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Age <span className="text-error">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                          errors.age ? "border-error" : "border-surface"
                        }`}
                        placeholder="Your age"
                        min="1"
                        max="120"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary">
                        {user?.age || "Not provided"}
                      </div>
                    )}
                    {errors.age && (
                      <p className="text-error text-sm mt-1">{errors.age}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary">
                        {user?.gender || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-md border border-surface overflow-hidden">
              <div className="bg-gradient-to-r from-secondary/5 to-secondary/10 px-6 py-4 border-b border-surface">
                <h3 className="text-lg font-semibold text-textPrimary flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-secondary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Contact Information
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                      placeholder="Your phone number"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary">
                      {user?.phone || "Not provided"}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 resize-none"
                      placeholder="Your address"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary min-h-[80px]">
                      {user?.address || "Not provided"}
                    </div>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-2">
                    Emergency Contact
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                      placeholder="Emergency contact name and phone"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary">
                      {user?.emergency_contact || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-2xl shadow-md border border-surface overflow-hidden">
              <div className="bg-gradient-to-r from-warning/5 to-warning/10 px-6 py-4 border-b border-surface">
                <h3 className="text-lg font-semibold text-textPrimary flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-warning"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Medical Information
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Medical History */}
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-3">
                    Medical History
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "Diabetes",
                        "Heart Disease",
                        "High Blood Pressure",
                        "Skin Allergies",
                        "Autoimmune Disorders",
                        "Cancer History",
                        "Mental Health Conditions",
                        "Other Chronic Conditions",
                        "None",
                      ].map((condition) => (
                        <label
                          key={condition}
                          className="flex items-center p-3 bg-surface/30 rounded-xl hover:bg-surface/50 transition-colors duration-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            name="medical_history"
                            value={condition}
                            checked={formData.medical_history.includes(
                              condition
                            )}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary bg-white border-2 border-surface rounded focus:ring-primary/20 focus:ring-2 mr-3"
                          />
                          <span className="text-sm text-textPrimary">
                            {condition}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user?.medical_history?.length > 0 ? (
                        user.medical_history.map((condition) => (
                          <span
                            key={condition}
                            className="px-3 py-1 bg-warning/10 text-warning rounded-full text-sm font-medium"
                          >
                            {condition}
                          </span>
                        ))
                      ) : (
                        <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary w-full">
                          No medical history recorded
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-2">
                    Allergies
                  </label>
                  {isEditing ? (
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 resize-none"
                      placeholder="List any known allergies"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary min-h-[80px]">
                      {user?.allergies || "No known allergies"}
                    </div>
                  )}
                </div>

                {/* Current Medications */}
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-2">
                    Current Medications
                  </label>
                  {isEditing ? (
                    <textarea
                      name="current_medications"
                      value={formData.current_medications}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 resize-none"
                      placeholder="List current medications and dosages"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-surface/30 rounded-xl text-textPrimary min-h-[80px]">
                      {user?.current_medications || "No current medications"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="bg-white rounded-2xl shadow-md border border-surface p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-6 py-3 border border-surface text-textSecondary rounded-xl hover:bg-surface/50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diagnosis History Tab Content */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-md border border-surface overflow-hidden">
            <div className="bg-gradient-to-r from-secondary/5 to-primary/5 px-6 py-4 border-b border-surface">
              <h3 className="text-lg font-semibold text-textPrimary flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-secondary"
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
                Your Diagnosis History
              </h3>
              <p className="text-sm text-textSecondary mt-1">
                View your past AI diagnosis results and track your skin health
              </p>
            </div>

            <div className="p-6">
              {diagnosisHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-textSecondary"
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
                  </div>
                  <h4 className="text-xl font-semibold text-textPrimary mb-2">
                    No Diagnosis History Yet
                  </h4>
                  <p className="text-textSecondary mb-6 max-w-md mx-auto">
                    You haven't performed any skin disease diagnoses yet. Start
                    your first analysis to begin tracking your skin health.
                  </p>
                  <button
                    onClick={() => navigate("/diagnosis")}
                    className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Your First Diagnosis
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {diagnosisHistory.map((diagnosis, index) => (
                    <div
                      key={diagnosis.id || index}
                      className="border border-surface rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Diagnosis Header */}
                      <div className="bg-surface/30 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm text-textSecondary">
                                {formatDate(diagnosis.timestamp)}
                              </div>
                              <div className="text-xs text-textSecondary">
                                Analysis #{diagnosisHistory.length - index}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceBgColor(
                              diagnosis.confidence
                            )} ${getConfidenceColor(diagnosis.confidence)}`}
                          >
                            {diagnosis.confidence}% confidence
                          </div>
                        </div>
                      </div>

                      {/* Diagnosis Content */}
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-textPrimary mb-1">
                              {diagnosis.prediction}
                            </h4>
                            <div className="flex items-center text-sm text-textSecondary">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Model: {diagnosis.model_used}
                            </div>
                          </div>
                          <button
                            className="px-4 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors duration-200 text-sm font-medium"
                            onClick={() => {
                              console.log("View details for:", diagnosis.id);
                            }}
                          >
                            <svg
                              className="w-4 h-4 mr-1 inline"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            View Details
                          </button>
                        </div>

                        {diagnosis.treatment && (
                          <div className="bg-surface/20 rounded-xl p-4 space-y-3">
                            <div>
                              <h5 className="font-medium text-textPrimary mb-1">
                                Description
                              </h5>
                              <p className="text-sm text-textSecondary">
                                {diagnosis.treatment.Description}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-textPrimary mb-1">
                                Consultation Advice
                              </h5>
                              <p className="text-sm text-textSecondary">
                                {diagnosis.treatment.Consult}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
