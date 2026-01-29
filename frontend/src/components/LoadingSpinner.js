import React, { useState, useEffect } from "react";

const LoadingSpinner = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  // Universal messages that work everywhere
  const messages = [
    { main: "Processing your request...", sub: "AI system is working" },
    { main: "Analyzing data...", sub: "Advanced algorithms running" },
    { main: "Almost ready...", sub: "Finalizing results" },
    { main: "Loading content...", sub: "Preparing your data" },
  ];

  // Universal steps that work for any operation
  const universalSteps = [
    { icon: "⚡", text: "Initializing" },
    { icon: "🔄", text: "Processing" },
    { icon: "🧠", text: "AI Analysis" },
    { icon: "✨", text: "Completing" },
  ];

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Animate steps and messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % universalSteps.length);
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = messages[messageIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full border border-gray-100">
        {/* SkinVista AI Branding */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-textPrimary mb-1">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkinVista AI
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-textSecondary text-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>AI System Active</span>
          </div>
        </div>

        {/* Main Spinner */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {/* Outer rotating ring */}
            <div className="w-24 h-24 relative">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-primary animate-spin"
                style={{
                  background: `conic-gradient(from 0deg, #4F46E5, #06B6D4, #4F46E5)`,
                  animation: "spin 2s linear infinite",
                }}
              ></div>
              <div className="absolute inset-1 rounded-full bg-white"></div>

              {/* Inner spinner with icon */}
              <div className="absolute inset-2 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-2xl animate-pulse">🤖</span>
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute -inset-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-secondary rounded-full animate-ping"
                  style={{
                    top: `${20 + Math.sin((i * Math.PI) / 3) * 30}%`,
                    left: `${50 + Math.cos((i * Math.PI) / 3) * 30}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "2s",
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"
              style={{
                width: "100%",
                background:
                  "linear-gradient(90deg, #4F46E5 0%, #06B6D4 50%, #4F46E5 100%)",
                backgroundSize: "200% 100%",
                animation: "progressShimmer 2s ease-in-out infinite",
              }}
            ></div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-textPrimary mb-2">
            {currentMessage.main}
            <span className="inline-block w-8 text-left">{dots}</span>
          </h3>

          <p className="text-sm text-textSecondary mb-4">
            {currentMessage.sub}
          </p>

          {/* Loading Steps */}
          <div className="space-y-2">
            {universalSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-500 ${
                  index === currentStep
                    ? "bg-surface text-textPrimary scale-105 shadow-sm"
                    : index < currentStep
                    ? "text-success bg-green-50"
                    : "text-textSecondary"
                }`}
              >
                <span
                  className={`text-2xl ${
                    index === currentStep ? "animate-bounce" : ""
                  }`}
                >
                  {index < currentStep ? "✅" : step.icon}
                </span>
                <span className="text-sm font-medium">{step.text}</span>

                {index === currentStep && (
                  <div className="ml-auto">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tech indicator */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-textSecondary">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>AI Processing</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span>Secure Connection</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
