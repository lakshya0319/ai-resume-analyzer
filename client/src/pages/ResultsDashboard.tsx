import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, CheckCircle2, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResultsDashboardProps {
  result: any;
  onBack: () => void;
}

export default function ResultsDashboard({ result, onBack }: ResultsDashboardProps) {
  const { analysis } = result;
  
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 75) return "score-badge-high";
    if (score >= 50) return "score-badge-medium";
    return "score-badge-low";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-300">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-slate-300">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeInUp">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Analysis Complete!</h1>
            <p className="text-slate-600">Here's your personalized resume optimization report</p>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ATS Score */}
            <div className="feature-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">ATS Compatibility Score</p>
                  <h2 className="text-2xl font-bold text-slate-900">Overall Assessment</h2>
                </div>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className={`score-badge ${getScoreBadgeClass(analysis.atsScore)}`}>
                  {analysis.atsScore}
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-primary h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${analysis.atsScore}%` }}
                />
              </div>
              <p className="text-sm text-slate-700 mt-4">{analysis.atsScoreExplanation}</p>
            </div>

            {/* Keyword Match */}
            <div className="feature-card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Keyword Matching</p>
                  <h2 className="text-2xl font-bold text-slate-900">Match Percentage</h2>
                </div>
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="score-badge score-badge-high">
                  {analysis.keywordMatchPercentage}%
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-accent h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${analysis.keywordMatchPercentage}%` }}
                />
              </div>
              <p className="text-sm text-slate-700 mt-4">
                {analysis.keywordMatchPercentage >= 75 
                  ? "Excellent keyword coverage!" 
                  : analysis.keywordMatchPercentage >= 50 
                  ? "Good keyword coverage, but can be improved" 
                  : "Add more keywords to improve your score"}
              </p>
            </div>
          </div>

          {/* Keyword Analysis */}
          <div className="feature-card">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Keyword Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-700">Matched Keywords</h3>
                  <span className="ml-auto text-sm font-bold text-green-700">
                    {analysis.matchedKeywords?.length || 0}
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysis.matchedKeywords?.map((keyword: string, idx: number) => (
                    <div key={idx} className="keyword-matched flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{keyword}</span>
                    </div>
                  ))}
                  {!analysis.matchedKeywords?.length && (
                    <p className="text-sm text-slate-500 italic">No matched keywords found</p>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-700">Missing Keywords</h3>
                  <span className="ml-auto text-sm font-bold text-red-700">
                    {analysis.missingKeywords?.length || 0}
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysis.missingKeywords?.map((keyword: string, idx: number) => (
                    <div key={idx} className="keyword-missing flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{keyword}</span>
                    </div>
                  ))}
                  {!analysis.missingKeywords?.length && (
                    <p className="text-sm text-slate-500 italic">All keywords covered!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Improvement Suggestions */}
          <div className="feature-card">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">AI Improvement Suggestions</h2>
            <div className="space-y-4">
              {analysis.improvementSuggestions?.map((suggestion: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg border-l-4 border-blue-500 bg-blue-50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${
                        suggestion.priority === "high" ? "bg-red-500" :
                        suggestion.priority === "medium" ? "bg-yellow-500" :
                        "bg-green-500"
                      }`}>
                        {suggestion.priority === "high" ? "!" :
                         suggestion.priority === "medium" ? "•" : "✓"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{suggestion.title}</h4>
                      <p className="text-slate-700 mb-2">{suggestion.description}</p>
                      {suggestion.example && (
                        <div className="mt-3 p-3 bg-white rounded border border-slate-200">
                          <p className="text-xs font-semibold text-slate-600 mb-1">Example:</p>
                          <p className="text-sm text-slate-700 italic">{suggestion.example}</p>
                        </div>
                      )}
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      suggestion.priority === "high" ? "bg-red-100 text-red-700" :
                      suggestion.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8">
            <Button
              onClick={onBack}
              className="gradient-primary text-white flex-1 py-6 text-lg font-semibold"
            >
              Analyze Another Resume
            </Button>
            <Button
              variant="outline"
              className="flex-1 py-6 text-lg font-semibold border-2 border-slate-300"
            >
              Save Results
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-slate-500 pt-8 border-t border-slate-200">
            <p>💡 Pro tip: Implement these suggestions and re-analyze to track your progress</p>
          </div>
        </div>
      </main>
    </div>
  );
}
