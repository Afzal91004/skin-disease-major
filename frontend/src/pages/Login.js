import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await login(formData);
      auth.login(result);
      navigate("/diagnosis");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Login failed",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-textPrimary font-semibold text-xl">
            Signing you in...
          </p>
          <p className="text-textSecondary text-base mt-2">
            Please wait while we authenticate your account
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-primary/10 p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🧬</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SkinVista AI
                </h1>
                <p className="text-sm text-textSecondary font-medium tracking-wider uppercase">
                  MEDICAL PLATFORM
                </p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-textPrimary mb-3">
              Welcome Back
            </h2>
            <p className="text-textSecondary text-base">
              Sign in to continue your skin health journey
            </p>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-gradient-to-r from-error/10 to-error/5 border border-error/20 rounded-2xl p-5 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-error/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-error text-lg">⚠️</span>
                </div>
                <p className="text-error text-base font-medium">
                  {errors.submit}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label
                htmlFor="email"
                className="block text-base font-semibold text-textPrimary"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-surface/50 border-2 rounded-2xl text-textPrimary text-base placeholder:text-textSecondary/60 focus:outline-none focus:border-primary transition-colors duration-200 ${
                  errors.email
                    ? "border-error bg-error/5"
                    : "border-surface hover:border-primary/30"
                }`}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-error text-sm mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-error rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label
                htmlFor="password"
                className="block text-base font-semibold text-textPrimary"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-surface/50 border-2 rounded-2xl text-textPrimary text-base placeholder:text-textSecondary/60 focus:outline-none focus:border-primary transition-colors duration-200 pr-14 ${
                    errors.password
                      ? "border-error bg-error/5"
                      : "border-surface hover:border-primary/30"
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center text-textSecondary hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/10"
                  disabled={isLoading}
                >
                  <span className="text-xl">{showPassword ? "👁️" : "👁️‍🗨️"}</span>
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-error rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-5 rounded-2xl font-semibold text-xl hover:from-indigo-700 hover:to-cyan-600 transform hover:scale-[1.02] transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-textSecondary text-base">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-primary hover:text-secondary font-semibold transition-colors duration-200"
              >
                Create one here
              </a>
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-primary/10">
          <h3 className="text-xl font-bold text-textPrimary mb-6 text-center">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose SkinVista AI?
            </span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🤖</span>
              </div>
              <p className="text-textSecondary text-base">
                Advanced AI diagnosis with 97% accuracy
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📱</span>
              </div>
              <p className="text-textSecondary text-base">
                Instant results from your mobile device
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-success/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💊</span>
              </div>
              <p className="text-textSecondary text-base">
                Personalized treatment recommendations
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🔒</span>
              </div>
              <p className="text-textSecondary text-base">
                Secure and private health data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
