// DiagnosisHistory.js - Redesigned with TailwindCSS and techy medical theme

import React, { useState, useEffect } from "react";
import { getDiagnosisHistory } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const DiagnosisHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const historyData = await getDiagnosisHistory();

      // Ensure safeHistory is always an array
      const safeHistory = Array.isArray(historyData)
        ? historyData
        : historyData?.history ?? [];

      setHistory(safeHistory);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Failed to load diagnosis history");
    } finally {
      setLoading(false);
    }
  };

  const safeHistory = Array.isArray(history) ? history : [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "text-success"; // Green
    if (confidence >= 70) return "text-warning"; // Orange
    return "text-error"; // Red
  };

  const getConfidenceBgColor = (confidence) => {
    if (confidence >= 90) return "bg-success/10 border-success/20"; // Green
    if (confidence >= 70) return "bg-warning/10 border-warning/20"; // Orange
    return "bg-error/10 border-error/20"; // Red
  };

  const getSeverityIcon = (prediction) => {
    if (prediction.includes("Bacterial") || prediction.includes("Parasitic")) {
      return { icon: "🔴", label: "Critical", color: "bg-error/10 text-error" };
    } else if (prediction.includes("Viral")) {
      return {
        icon: "🟡",
        label: "Moderate",
        color: "bg-warning/10 text-warning",
      };
    } else if (prediction.includes("Normal")) {
      return {
        icon: "🟢",
        label: "Normal",
        color: "bg-success/10 text-success",
      };
    }
    return {
      icon: "🔵",
      label: "Unknown",
      color: "bg-secondary/10 text-secondary",
    };
  };

  const handleViewDetails = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
  };

  const handleCloseDetails = () => {
    setSelectedDiagnosis(null);
  };

  const handleNewDiagnosis = () => {
    window.location.href = "/diagnosis";
  };

  if (loading) {
    return (
      <LoadingSpinner
        message="Loading your diagnosis history..."
        submessage="Please wait while we fetch your records"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-error/20 p-8 text-center">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              Error Loading History
            </h2>
            <p className="text-textSecondary mb-8">{error}</p>
            <button
              className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
              onClick={fetchHistory}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white border-b border-surface">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-textPrimary">
                  SkinVista AI
                </h1>
                <p className="text-textSecondary text-lg">
                  Diagnosis History & Medical Records
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                onClick={handleNewDiagnosis}
              >
                <svg
                  className="w-5 h-5 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                New Analysis
              </button>
              <button
                className="bg-surface text-textPrimary px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors duration-200 font-medium"
                onClick={fetchHistory}
              >
                <svg
                  className="w-5 h-5 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {safeHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-12 h-12 text-textSecondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              No Medical Records Found
            </h2>
            <p className="text-textSecondary text-lg mb-2">
              You haven't performed any skin analysis yet.
            </p>
            <p className="text-textSecondary mb-8">
              Start your first AI-powered diagnosis to see results here.
            </p>
            <button
              className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              onClick={handleNewDiagnosis}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Start First Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-primary">
                      {safeHistory.length}
                    </h3>
                    <p className="text-textSecondary font-medium">
                      Total Diagnoses
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-success/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-success">
                      {safeHistory.filter((h) => h.confidence >= 90).length}
                    </h3>
                    <p className="text-textSecondary font-medium">
                      High Confidence
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-success"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-secondary">
                      {
                        safeHistory.filter((h) => h.prediction === "Normal")
                          .length
                      }
                    </h3>
                    <p className="text-textSecondary font-medium">
                      Normal Results
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis Records */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-textPrimary mb-6">
                Medical Records
              </h2>
              {safeHistory.map((diagnosis) => {
                const severity = getSeverityIcon(diagnosis.prediction);
                return (
                  <div
                    key={diagnosis.id}
                    className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${severity.color}`}
                          >
                            {severity.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-textPrimary">
                                {diagnosis.prediction}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${severity.color}`}
                              >
                                {severity.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-textSecondary">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L16 7"
                                  />
                                </svg>
                                {formatDate(diagnosis.created_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                  />
                                </svg>
                                {diagnosis.model}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div
                            className={`px-4 py-2 rounded-xl border ${getConfidenceBgColor(
                              diagnosis.confidence
                            )}`}
                          >
                            <div className="text-center">
                              <div
                                className={`text-xl font-bold ${getConfidenceColor(
                                  diagnosis.confidence
                                )}`}
                              >
                                {diagnosis.confidence}%
                              </div>
                              <div className="text-xs text-textSecondary font-medium">
                                Confidence
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm"
                              onClick={() => handleViewDetails(diagnosis)}
                            >
                              <svg
                                className="w-4 h-4 inline-block mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>

                            {diagnosis.image_url && (
                              <button
                                className="bg-surface text-textPrimary px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors duration-200 font-medium text-sm"
                                onClick={() =>
                                  window.open(diagnosis.image_url, "_blank")
                                }
                              >
                                <svg
                                  className="w-4 h-4 inline-block mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                Image
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedDiagnosis && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-surface flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-textPrimary">
                    Detailed Analysis
                  </h2>
                  <p className="text-textSecondary">
                    AI-Powered Medical Assessment
                  </p>
                </div>
              </div>
              <button
                className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
                onClick={handleCloseDetails}
              >
                <svg
                  className="w-5 h-5 text-textSecondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-8">
                {/* Diagnosis Summary */}
                <div className="bg-surface rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-textPrimary mb-4">
                    Diagnosis Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getSeverityIcon(selectedDiagnosis.prediction).icon}
                      </span>
                      <div>
                        <h4 className="text-lg font-semibold text-textPrimary">
                          {selectedDiagnosis.prediction}
                        </h4>
                        <p className="text-textSecondary">
                          Analyzed on {formatDate(selectedDiagnosis.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-textSecondary font-medium">
                            Confidence Level
                          </span>
                          <span
                            className={`text-lg font-bold ${getConfidenceColor(
                              selectedDiagnosis.confidence
                            )}`}
                          >
                            {selectedDiagnosis.confidence}%
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-textSecondary font-medium">
                            AI Model
                          </span>
                          <span className="text-lg font-semibold text-textPrimary">
                            {selectedDiagnosis.model}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Original Image */}
                {selectedDiagnosis.image_url && (
                  <div>
                    <h4 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Original Sample Image
                    </h4>
                    <div className="bg-surface rounded-xl p-4">
                      <img
                        src={selectedDiagnosis.image_url}
                        alt="Diagnosis sample"
                        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Clinical Notes */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Clinical Notes & Recommendations
                  </h4>
                  <div className="space-y-3 text-textSecondary">
                    <p>
                      This AI-powered analysis was performed using the{" "}
                      <strong>{selectedDiagnosis.model}</strong> deep learning
                      model with a confidence level of{" "}
                      <strong>{selectedDiagnosis.confidence}%</strong>.
                    </p>
                    <p className="bg-warning/10 text-warning-800 p-3 rounded-lg border border-warning/20">
                      <strong>⚠️ Medical Disclaimer:</strong> This AI analysis
                      is for informational purposes only and should not replace
                      professional medical advice. Please consult with a
                      qualified healthcare professional for accurate diagnosis
                      and appropriate treatment recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-surface flex gap-3 justify-end">
              <button
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
                onClick={handleNewDiagnosis}
              >
                <svg
                  className="w-5 h-5 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                New Analysis
              </button>
              <button
                className="bg-surface text-textPrimary px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors duration-200 font-medium"
                onClick={handleCloseDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisHistory;
