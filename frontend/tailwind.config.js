/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo 600
        secondary: "#06B6D4", // Cyan 400
        background: "#F9FAFB",
        surface: "#F1F5F9",
        success: "#10B981",
        warning: "#F97316",
        error: "#EF4444",
        textPrimary: "#111827",
        textSecondary: "#64748B",
      },
    },
  },
  plugins: [],
};
