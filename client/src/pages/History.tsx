import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface HistoryProps {
  onBack: () => void;
}

export default function History({ onBack }: HistoryProps) {
  const { data: analyses, isLoading } = trpc.analysis.list.useQuery();
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedAnalysis(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
          </div>
        </header>

        <main className="container py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Analysis from {new Date(selectedAnalysis.createdAt).toLocaleDateString()}</h2>
              <p className="text-muted-foreground">ATS Score: {selectedAnalysis.atsScore} | Keyword Match: {selectedAnalysis.keywordMatchPercentage}%</p>
            </div>

            {/* Display similar to ResultsDashboard */}
            <Card className="premium-card p-8">
              <h3 className="text-lg font-semibold mb-4">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAnalysis.matchedKeywords.map((keyword: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Analysis History</h1>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {!analyses || analyses.length === 0 ? (
            <Card className="premium-card p-12 text-center">
              <p className="text-muted-foreground mb-4">No analyses yet</p>
              <Button onClick={onBack}>Start Your First Analysis</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis: any) => (
                <Card key={analysis.id} className="premium-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        Analysis from {new Date(analysis.createdAt).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Job Description: {analysis.jobDescription.substring(0, 100)}...
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="font-medium">ATS Score: <span className="text-primary">{analysis.atsScore}</span></span>
                        <span className="font-medium">Keyword Match: <span className="text-primary">{analysis.keywordMatchPercentage}%</span></span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
