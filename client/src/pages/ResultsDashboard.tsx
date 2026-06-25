import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResultsDashboardProps {
  result: any;
  onBack: () => void;
}

export default function ResultsDashboard({ result, onBack }: ResultsDashboardProps) {
  const { analysis } = result;
  
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 50) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ATS Score */}
            <Card className={`premium-card p-8 ${getScoreBgColor(analysis.atsScore)}`}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">ATS Compatibility Score</h3>
              <div className="flex items-end gap-4">
                <div className={`text-5xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                  {analysis.atsScore}
                </div>
                <div className="text-sm text-muted-foreground mb-2">/ 100</div>
              </div>
              <Progress value={analysis.atsScore} className="mt-4" />
              <p className="text-xs text-muted-foreground mt-3">
                {analysis.atsScore >= 75
                  ? "Excellent! Your resume is well-optimized for ATS systems."
                  : analysis.atsScore >= 50
                  ? "Good! Your resume has room for improvement."
                  : "Your resume needs optimization for better ATS compatibility."}
              </p>
            </Card>

            {/* Keyword Match */}
            <Card className={`premium-card p-8 ${getScoreBgColor(analysis.keywordMatchPercentage)}`}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Keyword Match</h3>
              <div className="flex items-end gap-4">
                <div className={`text-5xl font-bold ${getScoreColor(analysis.keywordMatchPercentage)}`}>
                  {analysis.keywordMatchPercentage}
                </div>
                <div className="text-sm text-muted-foreground mb-2">%</div>
              </div>
              <Progress value={analysis.keywordMatchPercentage} className="mt-4" />
              <p className="text-xs text-muted-foreground mt-3">
                {analysis.matchedKeywords.length} matched, {analysis.missingKeywords.length} missing keywords
              </p>
            </Card>
          </div>

          {/* Matched Keywords */}
          <Card className="premium-card p-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              Matched Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedKeywords.length > 0 ? (
                analysis.matchedKeywords.map((keyword: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-muted-foreground">No matched keywords found</p>
              )}
            </div>
          </Card>

          {/* Missing Keywords */}
          <Card className="premium-card p-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.length > 0 ? (
                analysis.missingKeywords.map((keyword: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-muted-foreground">All keywords matched!</p>
              )}
            </div>
          </Card>

          {/* Improvement Suggestions */}
          <Card className="premium-card p-8">
            <h3 className="text-lg font-semibold mb-6">Improvement Suggestions</h3>
            <div className="space-y-4">
              {analysis.improvementSuggestions.length > 0 ? (
                analysis.improvementSuggestions.map((suggestion: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{suggestion.category}</span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${
                              suggestion.priority === "high"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : suggestion.priority === "medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            {suggestion.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No suggestions at this time</p>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={onBack}>
              Analyze Another Resume
            </Button>
            <Button>
              View History
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
