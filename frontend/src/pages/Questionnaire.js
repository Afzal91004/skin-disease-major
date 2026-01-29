import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveQuestionnaire } from "../services/api";

const Questionnaire = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    symptom_duration: "",
    previous_treatment: "",
    pain_level: 0,
    affected_area: "",
    symptoms: [],
  });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "symptoms") {
      // checkbox array
      const newSymptoms = checked
        ? [...form.symptoms, value]
        : form.symptoms.filter((s) => s !== value);
      setForm({ ...form, symptoms: newSymptoms });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErr("");

    try {
      await saveQuestionnaire(form);
      navigate("/diagnosis");
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const symptomsOptions = [
    {
      value: "Itching",
      icon: "🔥",
      description: "Irritation or urge to scratch",
    },
    { value: "Pain", icon: "⚡", description: "Physical discomfort or aching" },
    {
      value: "Redness",
      icon: "🔴",
      description: "Red discoloration or inflammation",
    },
    {
      value: "Swelling",
      icon: "💧",
      description: "Puffiness or enlarged area",
    },
    {
      value: "Blisters",
      icon: "🫧",
      description: "Fluid-filled bumps or lesions",
    },
    { value: "Scaling", icon: "📋", description: "Flaky or peeling skin" },
  ];

  const getPainLevelColor = (level) => {
    if (level <= 3) return "text-success";
    if (level <= 6) return "text-warning";
    return "text-error";
  };

  const getPainLevelBg = (level) => {
    if (level <= 3) return "bg-success";
    if (level <= 6) return "bg-warning";
    return "bg-error";
  };

  const getPainDescription = (level) => {
    if (level === 0) return "No discomfort";
    if (level <= 3) return "Mild discomfort";
    if (level <= 6) return "Moderate pain";
    if (level <= 8) return "Severe pain";
    return "Extreme pain";
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-secondary"
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
          </div>
          <h1 className="text-3xl font-bold text-textPrimary mb-3">
            Medical Assessment
          </h1>
          <p className="text-lg text-textSecondary mb-2">
            Help our AI understand your condition better
          </p>
          <p className="text-textSecondary">
            This information improves diagnostic accuracy and personalized
            recommendations
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="ml-3 text-textPrimary font-medium">
                Patient Details
              </span>
            </div>
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">2</span>
              </div>
              <span className="ml-3 text-textPrimary font-medium">
                Health Assessment
              </span>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg border">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-textPrimary mb-2">
                Clinical History & Symptoms
              </h2>
              <p className="text-textSecondary">
                Please provide detailed information about your current condition
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Symptom Duration */}
              <div className="space-y-3">
                <label className="block text-textPrimary font-medium text-lg">
                  <svg
                    className="w-5 h-5 inline-block mr-3 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  When did you first notice these symptoms?
                </label>
                <p className="text-textSecondary text-sm ml-8 mb-3">
                  Duration helps determine the condition's progression and
                  severity
                </p>
                <div className="relative ml-8">
                  <select
                    name="symptom_duration"
                    value={form.symptom_duration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-background border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 text-textPrimary appearance-none cursor-pointer"
                  >
                    <option value="">Select timeline</option>
                    <option value="Less than 1 week">
                      Less than 1 week (Recent onset)
                    </option>
                    <option value="1-4 weeks">1-4 weeks (Subacute)</option>
                    <option value="More than 1 month">
                      More than 1 month (Chronic)
                    </option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Previous Treatment */}
              <div className="space-y-3">
                <label className="block text-textPrimary font-medium text-lg">
                  <svg
                    className="w-5 h-5 inline-block mr-3 text-secondary"
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
                  Have you tried any treatments for this condition?
                </label>
                <p className="text-textSecondary text-sm ml-8 mb-3">
                  Treatment history helps avoid ineffective options and build on
                  what works
                </p>
                <div className="relative ml-8">
                  <select
                    name="previous_treatment"
                    value={form.previous_treatment}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-background border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 text-textPrimary appearance-none cursor-pointer"
                  >
                    <option value="">Select treatment history</option>
                    <option value="None">
                      None - This is my first time seeking treatment
                    </option>
                    <option value="OTC creams">
                      Over-the-counter creams or ointments
                    </option>
                    <option value="Prescription">
                      Prescription medications from doctor
                    </option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Pain Level */}
              <div className="space-y-4">
                <label className="block text-textPrimary font-medium text-lg">
                  <svg
                    className="w-5 h-5 inline-block mr-3 text-secondary"
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
                  What's your current pain or discomfort level?
                </label>
                <p className="text-textSecondary text-sm ml-8 mb-4">
                  Rate from 0 (no pain) to 10 (extreme pain) - this helps assess
                  severity
                </p>

                <div className="ml-8 bg-background rounded-xl p-6 border border-surface">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-textSecondary font-medium">
                      No Pain
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-2xl font-bold ${getPainLevelColor(
                          form.pain_level
                        )}`}
                      >
                        {form.pain_level}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPainLevelColor(
                          form.pain_level
                        )} bg-opacity-10`}
                        style={{
                          backgroundColor: `${getPainLevelBg(
                            form.pain_level
                          )}20`,
                        }}
                      >
                        {getPainDescription(form.pain_level)}
                      </span>
                    </div>
                    <span className="text-sm text-textSecondary font-medium">
                      Extreme Pain
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      name="pain_level"
                      min={0}
                      max={10}
                      value={form.pain_level}
                      onChange={handleChange}
                      className="w-full h-3 bg-surface rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                          form.pain_level * 10
                        }%, #F1F5F9 ${form.pain_level * 10}%, #F1F5F9 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-textSecondary mt-2">
                      {Array.from({ length: 11 }, (_, i) => (
                        <span
                          key={i}
                          className={`${
                            form.pain_level === i
                              ? "text-textPrimary font-medium"
                              : ""
                          }`}
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Affected Area */}
              <div className="space-y-3">
                <label className="block text-textPrimary font-medium text-lg">
                  <svg
                    className="w-5 h-5 inline-block mr-3 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Which area of your body is affected?
                </label>
                <p className="text-textSecondary text-sm ml-8 mb-3">
                  Location helps narrow down potential conditions and treatment
                  options
                </p>
                <div className="relative ml-8">
                  <select
                    name="affected_area"
                    value={form.affected_area}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-background border border-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 text-textPrimary appearance-none cursor-pointer"
                  >
                    <option value="">Select affected area</option>
                    <option value="Face">
                      Face (including forehead, cheeks, chin)
                    </option>
                    <option value="Arms">
                      Arms (upper arms, forearms, hands)
                    </option>
                    <option value="Legs">Legs (thighs, calves, feet)</option>
                    <option value="Torso">Torso (chest, back, abdomen)</option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Symptoms Checklist */}
              <div className="space-y-4">
                <label className="block text-textPrimary font-medium text-lg">
                  <svg
                    className="w-5 h-5 inline-block mr-3 text-secondary"
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
                  What symptoms are you experiencing? (Select all that apply)
                </label>
                <p className="text-textSecondary text-sm ml-8 mb-4">
                  Multiple symptoms help create a comprehensive clinical picture
                  for accurate diagnosis
                </p>

                <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {symptomsOptions.map((symptom) => (
                    <label
                      key={symptom.value}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        form.symptoms.includes(symptom.value)
                          ? "border-secondary bg-secondary/5 shadow-md"
                          : "border-surface bg-background hover:border-secondary/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={symptom.value}
                        checked={form.symptoms.includes(symptom.value)}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "symptoms",
                              value: symptom.value,
                              checked: e.target.checked,
                            },
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 transition-all duration-200 ${
                          form.symptoms.includes(symptom.value)
                            ? "border-secondary bg-secondary"
                            : "border-surface"
                        }`}
                      >
                        {form.symptoms.includes(symptom.value) && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{symptom.icon}</span>
                          <span className="font-medium text-textPrimary">
                            {symptom.value}
                          </span>
                        </div>
                        <p className="text-sm text-textSecondary">
                          {symptom.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {err && (
                <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-error flex-shrink-0"
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
                  <div>
                    <p className="text-error font-medium">Assessment Error</p>
                    <p className="text-error/80 text-sm">{err}</p>
                  </div>
                </div>
              )}

              {/* Summary Card */}
              {(form.symptom_duration ||
                form.affected_area ||
                form.symptoms.length > 0) && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
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
                    Assessment Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {form.symptom_duration && (
                      <div>
                        <span className="font-medium text-textPrimary">
                          Duration:
                        </span>
                        <span className="ml-2 text-textSecondary">
                          {form.symptom_duration}
                        </span>
                      </div>
                    )}
                    {form.affected_area && (
                      <div>
                        <span className="font-medium text-textPrimary">
                          Location:
                        </span>
                        <span className="ml-2 text-textSecondary">
                          {form.affected_area}
                        </span>
                      </div>
                    )}
                    {form.pain_level > 0 && (
                      <div>
                        <span className="font-medium text-textPrimary">
                          Pain Level:
                        </span>
                        <span
                          className={`ml-2 ${getPainLevelColor(
                            form.pain_level
                          )}`}
                        >
                          {form.pain_level}/10 -{" "}
                          {getPainDescription(form.pain_level)}
                        </span>
                      </div>
                    )}
                    {form.symptoms.length > 0 && (
                      <div>
                        <span className="font-medium text-textPrimary">
                          Symptoms:
                        </span>
                        <span className="ml-2 text-textSecondary">
                          {form.symptoms.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-secondary text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
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
                      Processing assessment...
                    </>
                  ) : (
                    <>
                      Proceed to AI Skin Analysis
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
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-textSecondary mb-4">
            Need help completing this assessment? Our medical team is here to
            assist.
          </p>
          <div className="flex items-center justify-center gap-6">
            <button className="text-secondary hover:text-cyan-600 font-medium flex items-center gap-2 transition-colors">
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Medical FAQ
            </button>
            <button className="text-secondary hover:text-cyan-600 font-medium flex items-center gap-2 transition-colors">
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
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1"
                />
              </svg>
              Live Medical Support
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #06b6d4;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #06b6d4;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Questionnaire;
