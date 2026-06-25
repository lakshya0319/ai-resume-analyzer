import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, BarChart3, Zap, Clock, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { getLoginUrl } from "@/const";
import AnalysisFlow from "@/pages/AnalysisFlow";
import History from "@/pages/History";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin">
            <Loader2 className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-slate-600">Loading your resume analyzer...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && showAnalysis) {
    return <AnalysisFlow onBack={() => setShowAnalysis(false)} />;
  }

  if (isAuthenticated && showHistory) {
    return <History onBack={() => setShowHistory(false)} />;
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold shadow-lg">
                RA
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Resume Analyzer</h1>
                <p className="text-xs text-slate-500">AI-Powered ATS Optimization</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-12">
          <div className="max-w-5xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-16 animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Welcome back, {user?.name}!</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Let's Optimize Your Resume
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Get AI-powered insights to make your resume stand out to applicant tracking systems and land more interviews.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  onClick={() => setShowAnalysis(true)}
                  className="gradient-primary text-white shadow-lg hover:shadow-xl"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Start New Analysis
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setShowHistory(true)}
                  className="border-2 border-slate-300 hover:border-slate-400"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  View History
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="feature-card">
                <div className="icon">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">ATS Scoring</h3>
                <p className="text-sm text-slate-600">
                  Get a detailed score on how well your resume is optimized for ATS systems
                </p>
              </div>

              <div className="feature-card">
                <div className="icon">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Keyword Matching</h3>
                <p className="text-sm text-slate-600">
                  See which job requirements you match and which keywords to add
                </p>
              </div>

              <div className="feature-card">
                <div className="icon">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Smart Suggestions</h3>
                <p className="text-sm text-slate-600">
                  Get AI-powered recommendations to improve your resume instantly
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Why Use Resume Analyzer?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: CheckCircle2, title: "Beat the ATS", desc: "Optimize your resume to pass automated screening systems" },
                  { icon: TrendingUp, title: "Increase Interview Rate", desc: "Get actionable insights to improve your chances" },
                  { icon: Zap, title: "AI-Powered Analysis", desc: "Advanced algorithms analyze your resume in seconds" },
                  { icon: Clock, title: "Track Progress", desc: "Monitor improvements across multiple analyses" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-600 mt-1" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Landing Page for Unauthenticated Users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold shadow-lg">
              RA
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Resume Analyzer</h1>
              <p className="text-xs text-slate-400">AI-Powered ATS Optimization</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = getLoginUrl()}
            className="gradient-primary text-white shadow-lg"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Get Your Resume <span className="gradient-primary text-transparent bg-clip-text">ATS-Ready</span>
          </h2>
          
          <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Stop losing opportunities to applicant tracking systems. Get instant AI-powered insights on ATS compatibility, keyword matching, and actionable improvements.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => window.location.href = getLoginUrl()}
            className="gradient-primary text-white shadow-xl hover:shadow-2xl text-lg px-8 py-6"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Upload,
              title: "Upload Resume",
              desc: "Support for PDF and DOCX formats with automatic text extraction"
            },
            {
              icon: BarChart3,
              title: "Get Analysis",
              desc: "Receive ATS scores, keyword matching, and AI-generated suggestions"
            },
            {
              icon: TrendingUp,
              title: "Track Progress",
              desc: "Save all analyses and compare improvements over time"
            }
          ].map((item, idx) => (
            <div key={idx} className="feature-card bg-slate-800/50 border-slate-700">
              <div className="icon bg-gradient-primary">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center mb-20 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-8">Why Resume Analyzer?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-100 mb-2">75%</div>
              <p className="text-blue-100">of resumes rejected by ATS</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-100 mb-2">2x</div>
              <p className="text-blue-100">more interviews with optimization</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-100 mb-2">10s</div>
              <p className="text-blue-100">instant AI analysis</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to Optimize Your Resume?</h3>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of job seekers who've improved their ATS scores and landed more interviews.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = getLoginUrl()}
            className="gradient-primary text-white shadow-lg hover:shadow-xl text-lg px-8 py-6"
          >
            Start Free Analysis
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8 mt-20">
        <div className="container text-center text-slate-400">
          <p>© 2026 Resume Analyzer. Built with AI to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
}
