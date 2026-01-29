import React, { useState, useRef } from "react";

const ImageUpload = ({ onImageSelect, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setSelectedImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  const processImage = () => {
    if (!selectedImage) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result.split(",")[1];
      onImageSelect(base64String);
    };
    reader.readAsDataURL(selectedImage);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />

      {!previewUrl ? (
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-textPrimary mb-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Upload Medical Image
              </span>
            </h3>
            <p className="text-textSecondary text-sm">
              Upload a clear photo of the affected skin area for AI analysis
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
              transition-all duration-300 hover:scale-[1.02]
              ${
                dragActive
                  ? "border-primary bg-blue-50 scale-[1.02]"
                  : "border-gray-300 hover:border-primary hover:bg-gray-50"
              }
            `}
            onClick={triggerFileInput}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Upload Icon */}
            <div
              className={`
              w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
              ${
                dragActive
                  ? "bg-gradient-to-br from-primary to-secondary shadow-lg scale-110"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-primary hover:to-secondary hover:shadow-lg"
              } transition-all duration-300
            `}
            >
              <svg
                className={`w-10 h-10 ${
                  dragActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-white"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            {/* Upload Text */}
            <div className="space-y-2">
              <p className="text-textPrimary font-semibold text-lg">
                {dragActive
                  ? "Drop your image here"
                  : "Click to upload or drag & drop"}
              </p>
              <p className="text-textSecondary text-sm">
                Supports JPG, PNG, GIF files up to 10MB
              </p>
            </div>

            {/* Tech Features */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-textSecondary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>AI-Ready Processing</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Secure Upload</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  Image Ready for Analysis
                </h3>
                <p className="text-sm opacity-90">
                  AI diagnostic scan prepared
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm">Ready</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6">
            <div className="relative mx-auto max-w-md">
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <img
                  src={previewUrl}
                  alt="Selected medical image"
                  className="w-full h-80 object-cover"
                />

                {/* Analysis Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent">
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-primary bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                          <span>Image processed successfully</span>
                        </div>
                        <span className="text-xs opacity-75">
                          {(selectedImage?.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scanning Frame */}
                <div className="absolute inset-0 border-2 border-secondary rounded-2xl opacity-50">
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-secondary"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-secondary"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-secondary"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-secondary"></div>
                </div>
              </div>

              {/* File Info */}
              <div className="mt-4 bg-surface rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-textSecondary">
                    <span className="font-medium text-textPrimary">File:</span>{" "}
                    {selectedImage?.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-success font-medium">Validated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={processImage}
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
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Start AI Diagnosis
                  </div>
                )}
              </button>

              <button
                onClick={clearImage}
                disabled={isLoading}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${
                    isLoading
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-warning hover:bg-orange-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
