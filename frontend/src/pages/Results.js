import React from "react";

const Results = ({ result }) => {
  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-textSecondary"
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
          <h3 className="text-lg font-semibold text-textPrimary mb-2">
            No Result Available
          </h3>
          <p className="text-textSecondary">
            Please upload an image for diagnosis to view results.
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h1 className="text-2xl font-bold text-textPrimary">
                <span className="text-primary">SkinVista</span> AI Diagnosis
              </h1>
              <p className="text-textSecondary">
                Advanced AI-powered skin condition analysis
              </p>
            </div>
          </div>

          {/* Diagnosis Result Card */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-textPrimary">
                  Detected Condition
                </h3>
              </div>
              <div className="bg-white rounded-lg p-4 border border-primary/20">
                <p className="text-xl font-bold text-primary mb-1">
                  {result.prediction}
                </p>
                <p className="text-sm text-textSecondary">
                  AI-identified skin condition
                </p>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-secondary"
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
                <h3 className="text-lg font-semibold text-textPrimary">
                  Confidence Level
                </h3>
              </div>
              <div
                className={`rounded-lg p-4 border ${getConfidenceBgColor(
                  result.confidence
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-2xl font-bold ${getConfidenceColor(
                      result.confidence
                    )}`}
                  >
                    {result.confidence}%
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        result.confidence >= 90
                          ? "bg-success"
                          : result.confidence >= 70
                          ? "bg-warning"
                          : "bg-error"
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-textSecondary">
                  Diagnostic accuracy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Section */}
        {result.treatment && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-success"
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
                <h2 className="text-xl font-bold text-textPrimary">
                  Treatment & Medical Advice
                </h2>
                <p className="text-textSecondary">
                  AI-generated treatment recommendations
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-textPrimary mb-3 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Condition Overview
              </h3>
              <p className="text-textPrimary leading-relaxed">
                {result.treatment.Description}
              </p>
            </div>

            {/* Treatment Steps */}
            <div className="bg-surface rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center">
                <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                Recommended Treatment Steps
              </h3>
              <div className="space-y-3">
                {result.treatment.Treatment.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 bg-white rounded-lg p-4 border border-gray-100"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-semibold">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-textPrimary leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Consultation */}
            <div className="bg-gradient-to-r from-error/5 to-warning/5 rounded-xl p-6 border border-error/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-error"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-textPrimary mb-2 flex items-center">
                    <span className="text-error">⚠️</span>
                    <span className="ml-2">
                      Professional Medical Consultation
                    </span>
                  </h3>
                  <p className="text-textPrimary leading-relaxed mb-4">
                    {result.treatment.Consult}
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-error/20">
                    <p className="text-sm text-textSecondary">
                      <strong className="text-textPrimary">Disclaimer:</strong>{" "}
                      This AI diagnosis is for informational purposes only and
                      should not replace professional medical advice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-textSecondary">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>
              Powered by <strong className="text-primary">SkinVista AI</strong>{" "}
              - Advanced Deep Learning Technology
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
