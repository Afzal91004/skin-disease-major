import React, { useState } from "react";
import { jsPDF } from "jspdf"; // Direct import - much more reliable!

const ResultDisplay = ({ result, model, onNewDiagnosis }) => {
  const [showFullTreatment, setShowFullTreatment] = useState(false);

  if (!result) return null;

  const { prediction, treatment, confidence } = result;

  const getConfidenceColor = (conf) => {
    if (conf >= 90) return "text-success"; // High confidence
    if (conf >= 70) return "text-warning"; // Medium confidence
    return "text-error"; // Low confidence
  };

  const getConfidenceBgColor = (conf) => {
    if (conf >= 90) return "bg-success"; // High confidence
    if (conf >= 70) return "bg-warning"; // Medium confidence
    return "bg-error"; // Low confidence
  };

  const getConfidenceLevel = (conf) => {
    if (conf >= 90) return "High";
    if (conf >= 70) return "Medium";
    return "Low";
  };

  const getSeverityColor = (disease) => {
    const urgent = ["Bacterial", "Parasitic"];
    const moderate = ["Viral"];
    if (urgent.some((keyword) => disease.includes(keyword))) {
      return "from-error/20 to-error/5 border-error/30"; // Urgent
    } else if (moderate.some((keyword) => disease.includes(keyword))) {
      return "from-warning/20 to-warning/5 border-warning/30"; // Moderate
    }
    return "from-success/20 to-success/5 border-success/30"; // Mild
  };

  const getSeverityIcon = (disease) => {
    const urgent = ["Bacterial", "Parasitic"];
    const moderate = ["Viral"];
    if (urgent.some((keyword) => disease.includes(keyword))) {
      return (
        <div className="w-12 h-12 bg-error/20 rounded-2xl flex items-center justify-center">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.05 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      );
    } else if (moderate.some((keyword) => disease.includes(keyword))) {
      return (
        <div className="w-12 h-12 bg-warning/20 rounded-2xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-warning"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-success/20 rounded-2xl flex items-center justify-center">
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
    );
  };

  // Simplified and Reliable PDF Generation Function
  const downloadReport = async () => {
    try {
      // No more dynamic import - direct usage!
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;

      // Helper function to add text with word wrapping
      const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * (fontSize * 0.4);
      };

      // Header Section with SkinVista AI Branding
      doc.setFillColor(79, 70, 229); // Primary color
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, "bold");
      doc.text("SkinVista AI", 20, 25);

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text("Professional Skin Diagnosis Report", 20, 32);

      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition = 55;

      // Report Information Section
      doc.setFillColor(249, 250, 251); // Background color
      doc.rect(15, yPosition - 5, pageWidth - 30, 25, "F");

      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Report Information", 20, yPosition + 5);

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(`Report ID: SKIN-${Date.now()}`, 20, yPosition + 12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition + 18);
      doc.text(`AI Model: ${model}`, 120, yPosition + 12);
      doc.text(`Analysis Version: 2.0`, 120, yPosition + 18);

      yPosition += 35;

      // Diagnosis Section
      doc.setFillColor(79, 70, 229);
      doc.rect(15, yPosition, pageWidth - 30, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("DIAGNOSIS RESULTS", 20, yPosition + 5);

      doc.setTextColor(0, 0, 0);
      yPosition += 15;

      // Diagnosis Details Box
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(0.5);
      doc.rect(15, yPosition, pageWidth - 30, 40);

      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Detected Condition:", 20, yPosition + 10);
      doc.setTextColor(79, 70, 229);
      doc.text(prediction, 20, yPosition + 18);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("Confidence Level:", 20, yPosition + 28);

      // Confidence color based on level
      const confidenceColor =
        confidence >= 90
          ? [16, 185, 129]
          : confidence >= 70
          ? [249, 115, 22]
          : [239, 68, 68];
      doc.setTextColor(...confidenceColor);
      doc.text(
        `${confidence}% (${getConfidenceLevel(confidence)})`,
        20,
        yPosition + 35
      );

      yPosition += 50;

      // Handle missing treatment data
      const safeDescription =
        treatment?.Description || "No description available";
      const safeTreatment = treatment?.Treatment || [
        "No treatment information available",
      ];
      const safeConsult =
        treatment?.Consult || "Consult a healthcare professional";

      // Condition Overview Section
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(6, 182, 212);
      doc.rect(15, yPosition, pageWidth - 30, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("CONDITION OVERVIEW", 20, yPosition + 5);

      doc.setTextColor(0, 0, 0);
      yPosition += 15;

      yPosition = addWrappedText(
        safeDescription,
        20,
        yPosition,
        pageWidth - 40,
        10
      );
      yPosition += 10;

      // Treatment Recommendations Section
      doc.setFillColor(16, 185, 129);
      doc.rect(15, yPosition, pageWidth - 30, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("TREATMENT RECOMMENDATIONS", 20, yPosition + 5);

      doc.setTextColor(0, 0, 0);
      yPosition += 15;

      // Treatment Steps
      safeTreatment.forEach((step, index) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text(`${index + 1}.`, 20, yPosition);

        doc.setFont(undefined, "normal");
        yPosition = addWrappedText(step, 30, yPosition, pageWidth - 50, 10);
        yPosition += 6;
      });

      // Doctor Consultation Section
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      const isConsultRequired =
        safeConsult.toLowerCase().includes("yes") ||
        safeConsult.toLowerCase().includes("essential") ||
        safeConsult.toLowerCase().includes("recommended");

      const consultColor = isConsultRequired ? [239, 68, 68] : [16, 185, 129];
      doc.setFillColor(...consultColor);
      doc.rect(15, yPosition, pageWidth - 30, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("MEDICAL CONSULTATION", 20, yPosition + 5);

      doc.setTextColor(0, 0, 0);
      yPosition += 15;

      yPosition = addWrappedText(
        safeConsult,
        20,
        yPosition,
        pageWidth - 40,
        10
      );
      yPosition += 15;

      // Medical Disclaimer
      doc.setFillColor(249, 115, 22);
      doc.rect(15, yPosition, pageWidth - 30, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("IMPORTANT MEDICAL DISCLAIMER", 20, yPosition + 5);

      doc.setTextColor(0, 0, 0);
      yPosition += 15;

      const disclaimer =
        "This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper medical evaluation and care. SkinVista AI is a diagnostic aid tool and should be used in conjunction with professional medical judgment.";
      yPosition = addWrappedText(disclaimer, 20, yPosition, pageWidth - 40, 9);

      // Footer
      const footerY = pageHeight - 20;
      doc.setFillColor(241, 245, 249);
      doc.rect(0, footerY - 10, pageWidth, 20, "F");
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text(
        "Generated by SkinVista AI - Advanced Deep Learning Technology",
        20,
        footerY - 3
      );
      doc.text(
        `Report Date: ${new Date().toLocaleDateString()} | Confidential Medical Document`,
        20,
        footerY + 3
      );
      doc.text(
        `Page 1 of ${doc.internal.getNumberOfPages()}`,
        pageWidth - 40,
        footerY - 3
      );

      // Save the PDF - This should work now!
      doc.save(`SkinVista-AI-Report-${Date.now()}.pdf`);

      // Success notification (optional)
      console.log("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Much simpler fallback - only if PDF really fails
      const reportData = {
        diagnosis: prediction,
        confidence: confidence,
        model: model,
        timestamp: new Date().toLocaleString(),
        treatment: treatment,
        error: "PDF generation failed",
      };

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = `skin-diagnosis-${Date.now()}.json`;
      link.click();
    }
  };

  const shareResult = async () => {
    if (!navigator.canShare || !navigator.canShare({ files: [] })) {
      // fallback: share text + webpage url
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Skin Diagnosis Result",
            text: `AI Diagnosis: ${prediction} (${confidence}% confidence)`,
            url: window.location.href,
          });
        } catch (error) {
          console.error("Error sharing:", error);
        }
      } else {
        // fallback: copy to clipboard
        const textToCopy = `AI Skin Diagnosis Result:\n${prediction}\nConfidence: ${confidence}%\nGenerated on: ${new Date().toLocaleString()}`;
        navigator.clipboard.writeText(textToCopy);
        alert("Result copied to clipboard!");
      }
      return;
    }

    try {
      // Generate PDF blob using jsPDF (same code as downloadReport but output blob)
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * (fontSize * 0.4);
      };

      // Add content to PDF as in downloadReport...
      doc.setFontSize(20);
      doc.text("SkinVista AI - Diagnosis Report", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;
      doc.setFontSize(14);
      doc.text(`Condition: ${prediction}`, 10, yPosition);
      yPosition += 10;
      doc.text(
        `Confidence: ${confidence}% (${getConfidenceLevel(confidence)})`,
        10,
        yPosition
      );
      yPosition += 15;
      yPosition = addWrappedText(
        treatment.Description || "No description available",
        10,
        yPosition,
        pageWidth - 20
      );
      yPosition += 10;
      yPosition = addWrappedText(
        `Consult: ${treatment.Consult || "Consult a doctor"}`,
        10,
        yPosition,
        pageWidth - 20
      );
      yPosition += 20;

      // Output the PDF as blob
      const pdfBlob = doc.output("blob");
      const filesArray = [
        new File([pdfBlob], `SkinVistaAI_Report_${Date.now()}.pdf`, {
          type: "application/pdf",
        }),
      ];

      await navigator.share({
        files: filesArray,
        title: "Skin Diagnosis Report",
        text: `AI Diagnosis: ${prediction} (${confidence}% confidence). View full report attached.`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Sharing failed:", error);
      alert("Sharing failed. Please try again.");
    }
  };

  // Handle missing treatment data
  const safeDescription = treatment?.Description || "No description available";
  const safeTreatment = treatment?.Treatment || [
    "No treatment information available",
  ];
  const safeConsult = treatment?.Consult || "Consult a healthcare professional";

  const isConsultRequired =
    safeConsult.toLowerCase().includes("yes") ||
    safeConsult.toLowerCase().includes("essential") ||
    safeConsult.toLowerCase().includes("recommended");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SkinVista AI
              </h1>
              <p className="text-textSecondary text-lg">Diagnosis Results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Diagnosis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnosis Card */}
            <div
              className={`bg-gradient-to-r ${getSeverityColor(
                prediction
              )} border rounded-2xl shadow-lg overflow-hidden`}
            >
              <div className="p-8">
                <div className="flex items-start space-x-4">
                  {getSeverityIcon(prediction)}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-textPrimary mb-2 flex items-center">
                      Diagnosis Result
                    </h2>
                    <h3 className="text-3xl font-bold text-textPrimary mb-6">
                      {prediction}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-textSecondary font-medium">
                            Model Used
                          </span>
                          <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
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
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <p className="text-textPrimary font-bold text-lg">
                          {model}
                        </p>
                      </div>

                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-textSecondary font-medium">
                            Confidence Level
                          </span>
                          <div
                            className={`w-8 h-8 ${getConfidenceBgColor(
                              confidence
                            )}/20 rounded-lg flex items-center justify-center`}
                          >
                            <svg
                              className={`w-4 h-4 ${getConfidenceColor(
                                confidence
                              )}`}
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
                        <div className="flex items-center space-x-3">
                          <p
                            className={`font-bold text-lg ${getConfidenceColor(
                              confidence
                            )}`}
                          >
                            {getConfidenceLevel(confidence)} ({confidence}%)
                          </p>
                        </div>
                        <div className="mt-3 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getConfidenceBgColor(
                              confidence
                            )}`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment Information */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-textPrimary flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  About This Condition
                </h3>
              </div>
              <div className="p-6">
                <p className="text-textSecondary leading-relaxed text-lg">
                  {safeDescription}
                </p>
              </div>
            </div>

            {/* Treatment Recommendations */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-secondary/5 to-primary/5 p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-textPrimary flex items-center">
                  <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center mr-3">
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
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  Recommended Treatment
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {safeTreatment.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 bg-surface rounded-xl p-4"
                    >
                      <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-secondary font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-textPrimary leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Doctor Consultation */}
            <div
              className={`rounded-2xl shadow-md border overflow-hidden ${
                isConsultRequired
                  ? "bg-gradient-to-r from-error/10 to-error/5 border-error/30"
                  : "bg-gradient-to-r from-success/10 to-success/5 border-success/30"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isConsultRequired ? "bg-error/20" : "bg-success/20"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 ${
                        isConsultRequired ? "text-error" : "text-success"
                      }`}
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
                    <h4 className="text-xl font-bold text-textPrimary mb-2">
                      Doctor Consultation
                    </h4>
                    <p
                      className={`text-lg font-semibold ${
                        isConsultRequired ? "text-error" : "text-success"
                      }`}
                    >
                      {safeConsult}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center mr-2">
                  <svg
                    className="w-3 h-3 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={onNewDiagnosis}
                  className="w-full bg-primary text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
                >
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>New Diagnosis</span>
                </button>

                <button
                  onClick={downloadReport}
                  className="w-full bg-success text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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
                      d="M12 4v16m0 0l-4-4m4 4l4-4"
                    />
                  </svg>
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={shareResult}
                  className="w-full bg-info text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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
                      d="M12 19V6m0 0l-3 3m3-3l3 3"
                    />
                  </svg>
                  <span>Share Result</span>
                </button>
              </div>
            </div>
            {/* Additional info or tips can go here */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <h4 className="text-xl font-semibold text-textPrimary mb-2">
                Tips & Recommendations
              </h4>
              <ul className="list-disc list-inside text-textSecondary space-y-2">
                <li>Ensure your skin remains clean and moisturized.</li>
                <li>Follow prescribed treatments for best results.</li>
                <li>Schedule regular skin checkups.</li>
                <li>Use sunscreen daily to protect against UV damage.</li>
                <li>
                  Contact a healthcare professional for severe or worsening
                  symptoms.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side or Additional Info can be added here */}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
