import React, { useState, useRef } from "react";
import Camera from "../components/Camera";
import ImageUpload from "../components/ImageUpload";
import ResultDisplay from "../components/ResultDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import { predictDisease, getPerformance } from "../services/api";

const Diagnosis = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("MobileNet");
  const [mode, setMode] = useState("upload"); // 'upload' or 'camera'
  const [performance, setPerformance] = useState(null);
  const [error, setError] = useState(null);

  const fetchPerformance = async () => {
    try {
      const perf = await getPerformance();
      setPerformance(perf);
    } catch (err) {
      console.error("Failed to fetch performance data:", err);
    }
  };

  React.useEffect(() => {
    fetchPerformance();
  }, []);

  const handleAnalysis = async (imageBase64) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictDisease(imageBase64, model);
      setResult(prediction);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Error during prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewDiagnosis = () => {
    setResult(null);
    setError(null);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResult(null);
    setError(null);
  };

  const handleModelChange = (newModel) => {
    setModel(newModel);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-2xl shadow-lg">
              <svg
                className="w-12 h-12 text-white"
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
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
            <span className="text-primary">SkinVista</span> AI
          </h1>
          <p className="text-xl text-textSecondary font-medium">
            Advanced Dermatological Analysis System
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Model Selection Card */}
        <div className="bg-white rounded-2xl shadow-md border border-surface mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-surface">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Model Selection
            </h3>
            <p className="text-sm text-textSecondary mt-1">
              Choose your preferred neural network architecture
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleModelChange("MobileNet")}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  model === "MobileNet"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-surface hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-success to-success/70 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-textPrimary">
                        MobileNet
                      </h4>
                      <p className="text-sm text-textSecondary">
                        Fast & Efficient
                      </p>
                    </div>
                  </div>
                  {model === "MobileNet" && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
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
                  )}
                </div>
              </button>

              <button
                onClick={() => handleModelChange("InceptionV3")}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  model === "InceptionV3"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-surface hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <div className="text-left">
                      <h4 className="font-semibold text-textPrimary">
                        InceptionV3
                      </h4>
                      <p className="text-sm text-textSecondary">
                        High Precision
                      </p>
                    </div>
                  </div>
                  {model === "InceptionV3" && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
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
                  )}
                </div>
              </button>
            </div>

            {/* Performance Info */}
            {performance && (
              <div className="mt-6 p-4 bg-surface/50 rounded-xl">
                {performance.map((modelInfo) => (
                  <div
                    key={modelInfo.name}
                    className={`${
                      model === modelInfo.name ? "block" : "hidden"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-textPrimary">
                          {modelInfo.name} Performance
                        </h5>
                        <p className="text-sm text-textSecondary mt-1">
                          {modelInfo.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-textSecondary mr-2">
                            Accuracy:
                          </span>
                          <span className="font-semibold text-success">
                            {modelInfo.accuracy?.test || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          modelInfo.available
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {modelInfo.available ? (
                          <>
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Available
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Unavailable
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Method Selection */}
        <div className="bg-white rounded-2xl shadow-md border border-surface mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-secondary/5 to-primary/5 px-6 py-4 border-b border-surface">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-secondary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              Image Input Method
            </h3>
            <p className="text-sm text-textSecondary mt-1">
              Select how you want to provide the skin image
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleModeChange("upload")}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  mode === "upload"
                    ? "border-secondary bg-secondary/5 shadow-md"
                    : "border-surface hover:border-secondary/30 hover:shadow-sm"
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/70 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-textPrimary mb-2">
                    Upload Image
                  </h4>
                  <p className="text-sm text-textSecondary">
                    Choose from gallery or files
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleModeChange("camera")}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  mode === "camera"
                    ? "border-secondary bg-secondary/5 shadow-md"
                    : "border-surface hover:border-secondary/30 hover:shadow-sm"
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-textPrimary mb-2">
                    Take Photo
                  </h4>
                  <p className="text-sm text-textSecondary">
                    Use device camera
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-error/5 border border-error/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-error"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold text-error">
                  Analysis Error
                </h3>
                <p className="text-sm text-error/80 mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-3 bg-error hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <LoadingSpinner
            message={`🤖 ${model} is analyzing your image...`}
            submessage="This may take a few seconds"
          />
        )}

        {/* Input Components */}
        {!loading && !result && (
          <div className="bg-white rounded-2xl shadow-md border border-surface mb-8">
            {mode === "upload" && (
              <ImageUpload onImageSelect={handleAnalysis} isLoading={loading} />
            )}
            {mode === "camera" && (
              <Camera onCapture={handleAnalysis} isLoading={loading} />
            )}
          </div>
        )}

        {/* Results */}
        {!loading && result && (
          <ResultDisplay
            result={result}
            model={model}
            onNewDiagnosis={handleNewDiagnosis}
          />
        )}

        {/* Instructions */}
        {!loading && !result && !error && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-textPrimary mb-2">
                How to Use SkinVista AI
              </h4>
              <p className="text-textSecondary">
                Follow these steps for accurate skin analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">1</span>
                </div>
                <h5 className="font-medium text-textPrimary mb-1">
                  Select Model
                </h5>
                <p className="text-sm text-textSecondary">
                  Choose your preferred AI model
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">2</span>
                </div>
                <h5 className="font-medium text-textPrimary mb-1">
                  Input Method
                </h5>
                <p className="text-sm text-textSecondary">
                  Upload image or take photo
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">3</span>
                </div>
                <h5 className="font-medium text-textPrimary mb-1">
                  Clear Image
                </h5>
                <p className="text-sm text-textSecondary">
                  Provide clear skin area photo
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">4</span>
                </div>
                <h5 className="font-medium text-textPrimary mb-1">
                  Get Results
                </h5>
                <p className="text-sm text-textSecondary">
                  Review AI analysis results
                </p>
              </div>
            </div>

            <div className="bg-warning/5 border border-warning/20 rounded-xl p-6">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-warning flex-shrink-0 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h5 className="font-semibold text-warning mb-2">
                    Medical Disclaimer
                  </h5>
                  <p className="text-sm text-textSecondary">
                    This tool is for informational purposes only and should not
                    replace professional medical advice. Always consult a
                    qualified healthcare professional or dermatologist for
                    proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnosis;
