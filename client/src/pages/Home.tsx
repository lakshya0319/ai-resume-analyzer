import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, BarChart3, Zap, History as HistoryIcon } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                RA
              </div>
              <h1 className="text-xl font-bold">Resume Analyzer</h1>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Optimize Your Resume for ATS</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get AI-powered insights to make your resume stand out to applicant tracking systems
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={() => setShowAnalysis(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Start Analysis
                </Button>
                <Button size="lg" variant="outline" onClick={() => setShowHistory(true)}>
                  <HistoryIcon className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card className="premium-card p-6 hover:shadow-md transition-shadow">
                <BarChart3 className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">ATS Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  Get a detailed score on how well your resume is optimized for ATS systems
                </p>
              </Card>

              <Card className="premium-card p-6 hover:shadow-md transition-shadow">
                <Zap className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-semibold mb-2">Keyword Matching</h3>
                <p className="text-sm text-muted-foreground">
                  See which job requirements you match and which keywords to add
                </p>
              </Card>

              <Card className="premium-card p-6 hover:shadow-md transition-shadow">
                <HistoryIcon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Track History</h3>
                <p className="text-sm text-muted-foreground">
                  Keep all your analyses and revisit past results anytime
                </p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              RA
            </div>
            <h1 className="text-xl font-bold">Resume Analyzer</h1>
          </div>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Sign In
          </Button>
        </div>
      </header>

      <main className="container py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            Get Your Resume ATS-Ready
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Upload your resume and a job description to get AI-powered insights on ATS compatibility, keyword matching, and actionable improvement suggestions.
          </p>
          <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Upload Resume</h3>
            <p className="text-sm text-muted-foreground">
              Support for PDF and DOCX formats with automatic text extraction
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Get Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Receive ATS scores, keyword matching, and AI-generated suggestions
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <HistoryIcon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Save all analyses and compare improvements over time
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
