import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, ArrowLeft, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ResultsDashboard from "@/pages/ResultsDashboard";

interface AnalysisFlowProps {
  onBack: () => void;
}

export default function AnalysisFlow({ onBack }: AnalysisFlowProps) {
  const [step, setStep] = useState<"upload" | "results">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const mutation = trpc.resume.uploadAndAnalyze.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or DOCX file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);
      
      const result = await mutation.mutateAsync({
        fileBuffer: fileBuffer,
        fileName: file.name,
        fileType: file.type.includes("pdf") ? "pdf" : "docx",
        jobDescription,
      });

      setAnalysisResult(result);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze resume");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (step === "results" && analysisResult) {
    return <ResultsDashboard result={analysisResult} onBack={() => setStep("upload")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Analyze Resume</h1>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="premium-card p-8">
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3">Upload Resume</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    {file ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                        <p className="font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-muted-foreground">PDF or DOCX (max 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-semibold mb-3">Job Description</label>
                <Textarea
                  placeholder="Paste the job description you're applying for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-48 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Include the full job posting for best results
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !file || !jobDescription.trim()}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
