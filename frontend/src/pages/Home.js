import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex flex-col items-center justify-center px-6 py-12">
      {/* Main Content Container */}
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            {/* Brand Logo/Icon */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🧬</span>
              </div>
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SkinVista
                </h1>
                <p className="text-sm text-textSecondary font-medium tracking-wider uppercase">
                  AI-POWERED DIAGNOSTICS
                </p>
              </div>
            </div>
          </div>

          <p className="text-xl md:text-2xl text-textSecondary max-w-3xl mx-auto mb-10 leading-relaxed">
            Advanced AI-powered skin disease detection using{" "}
            <span className="text-primary font-semibold">MobileNet</span> &{" "}
            <span className="text-secondary font-semibold">InceptionV3</span>{" "}
            deep learning models for quick, accurate diagnosis and comprehensive
            treatment guidance.
          </p>

          {/* CTA Button */}
          <a
            href="/diagnosis"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-primary/20"
          >
            <span className="text-xl">🔬</span>
            Start AI Diagnosis
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
              BETA
            </span>
          </a>
        </div>

        {/* AI Capabilities Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-primary/10 hover:shadow-xl transition-all duration-300 hover:border-primary/30">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🦠</span>
            </div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              Bacterial Infections
            </h3>
            <p className="text-textSecondary text-sm">
              Detect and analyze bacterial skin conditions with high precision
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-secondary/10 hover:shadow-xl transition-all duration-300 hover:border-secondary/30">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🍄</span>
            </div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              Fungal Infections
            </h3>
            <p className="text-textSecondary text-sm">
              Identify fungal skin diseases using advanced pattern recognition
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-success/10 hover:shadow-xl transition-all duration-300 hover:border-success/30">
            <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🦠</span>
            </div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              Viral Conditions
            </h3>
            <p className="text-textSecondary text-sm">
              Detect viral skin manifestations with AI-powered analysis
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-warning/10 hover:shadow-xl transition-all duration-300 hover:border-warning/30">
            <div className="w-12 h-12 bg-gradient-to-br from-warning/20 to-warning/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🪱</span>
            </div>
            <h3 className="text-lg font-semibary text-textPrimary mb-2">
              Parasitic Infections
            </h3>
            <p className="text-textSecondary text-sm">
              Identify parasitic skin conditions through machine learning
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-primary/10">
          <h2 className="text-2xl font-bold text-textPrimary mb-6 text-center">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced AI Technology
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">MN</span>
              </div>
              <h3 className="font-semibold text-textPrimary mb-2">MobileNet</h3>
              <p className="text-textSecondary text-sm">
                Lightweight neural network for fast mobile processing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/60 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">IV3</span>
              </div>
              <h3 className="font-semibold text-textPrimary mb-2">
                InceptionV3
              </h3>
              <p className="text-textSecondary text-sm">
                Deep learning model for complex pattern recognition
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success to-success/60 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h3 className="font-semibold text-textPrimary mb-2">
                Neural Processing
              </h3>
              <p className="text-textSecondary text-sm">
                Advanced algorithms trained on medical datasets
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-textPrimary mb-3">
              Upload & Capture
            </h3>
            <p className="text-textSecondary">
              Upload existing photos or capture new ones for instant AI analysis
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary/10">
            <div className="text-4xl mb-4">💊</div>
            <h3 className="text-xl font-semibold text-textPrimary mb-3">
              Treatment Guidance
            </h3>
            <p className="text-textSecondary">
              Get comprehensive treatment recommendations based on AI diagnosis
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-success/10">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-textPrimary mb-3">
              History Tracking
            </h3>
            <p className="text-textSecondary">
              Track your diagnosis history and monitor skin health progress
            </p>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-gradient-to-r from-warning/10 to-error/10 border-l-4 border-warning p-8 rounded-r-2xl max-w-4xl mx-auto backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-warning text-xl">⚠️</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-textPrimary mb-3">
                Important Medical Disclaimer
              </h4>
              <div className="space-y-2 text-textSecondary">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warning rounded-full"></span>
                  This AI tool is designed for informational and educational
                  purposes only.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-error rounded-full"></span>
                  Always consult qualified healthcare professionals for proper
                  medical diagnosis.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  SkinVista AI assists in preliminary assessment but cannot
                  replace clinical examination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
