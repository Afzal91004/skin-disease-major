import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

const Camera = ({ onCapture, isLoading }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    // Convert base64 to just the data part
    const base64Data = imageSrc.split(",")[1];
    onCapture(base64Data);
    setShowCamera(false);
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImgSrc(null);
    setShowCamera(true);
  };

  const videoConstraints = {
    width: 320,
    height: 320,
    facingMode: "environment", // Use back camera on mobile
  };

  if (!showCamera && !imgSrc) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="text-center max-w-sm">
          {/* Medical Scanner Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {/* SkinVista AI Branding */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-textPrimary mb-1">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SkinVista AI
              </span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-textSecondary text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>AI-Powered Skin Analysis</span>
            </div>
          </div>

          <p className="text-textSecondary mb-2 text-sm leading-relaxed">
            Position the affected skin area clearly in the frame
          </p>
          <p className="text-xs text-textSecondary mb-6 opacity-75">
            Ensure good lighting for accurate diagnosis
          </p>

          <button
            onClick={() => setShowCamera(true)}
            disabled={isLoading}
            className={`
              w-full py-3 px-6 rounded-xl font-medium text-white 
              transition-all duration-300 shadow-lg
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5"
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
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
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Start Diagnosis Scan
              </div>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {showCamera && !imgSrc && (
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">SkinVista Scanner</h3>
                <p className="text-sm opacity-90">
                  Position skin area in center
                </p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Camera View */}
          <div className="relative p-6 bg-gray-900">
            <div className="relative mx-auto w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
              />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 border-2 border-secondary rounded-2xl">
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-secondary"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-secondary"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-secondary"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-secondary"></div>
              </div>
            </div>

            {/* AI Processing Indicator */}
            <div className="flex items-center justify-center mt-4 text-white text-sm">
              <div className="flex items-center gap-2 bg-black bg-opacity-30 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span>AI Vision Active</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 bg-surface">
            <div className="flex gap-3 justify-center">
              <button
                onClick={capture}
                disabled={isLoading}
                className={`
                  flex-1 max-w-xs py-3 px-6 rounded-xl font-medium text-white 
                  transition-all duration-300 shadow-lg
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-success hover:bg-green-600 hover:shadow-xl transform hover:-translate-y-0.5"
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                  </svg>
                  Capture & Analyze
                </div>
              </button>

              <button
                onClick={() => setShowCamera(false)}
                className="px-6 py-3 rounded-xl font-medium text-textSecondary hover:text-textPrimary hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {imgSrc && (
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Image Captured</h3>
                <p className="text-sm opacity-90">Ready for AI analysis</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Captured</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6">
            <div className="relative mx-auto w-80 h-80 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img
                src={imgSrc}
                alt="Captured skin area"
                className="w-full h-full object-cover"
              />

              {/* Analysis Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent">
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-primary bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                      <span>Image ready for analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={retake}
                disabled={isLoading}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg
                  ${
                    isLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-warning hover:bg-orange-600 text-white hover:shadow-xl transform hover:-translate-y-0.5"
                  }
                `}
              >
                <div className="flex items-center gap-2">
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Retake Photo
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
