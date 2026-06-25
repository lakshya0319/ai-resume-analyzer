import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, ArrowLeft, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
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
        toast.error("Invalid file format");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        toast.error("File too large");
        return;
      }
      setFile(selectedFile);
      setError(null);
      toast.success("Resume uploaded!");
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description");
      toast.error("Missing required fields");
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
      toast.success("Analysis complete!");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to analyze resume";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (step === "results" && analysisResult) {
    return <ResultsDashboard result={analysisResult} onBack={() => {
      setStep("upload");
      setFile(null);
      setJobDescription("");
      setAnalysisResult(null);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Analyze Your Resume</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="animate-fadeInUp">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600">Step 1 of 2</span>
                <span className="text-sm font-semibold text-slate-600">Resume Upload & Analysis</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full transition-all duration-500" style={{ width: "50%" }} />
              </div>
            </div>

            <div className="feature-card p-8 space-y-8">
              {/* File Upload Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                  <label className="text-lg font-semibold text-slate-900">Upload Your Resume</label>
                </div>
                
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    {file ? (
                      <div className="flex items-center justify-center gap-3 animate-slideInRight">
                        <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-900">{file.name}</p>
                          <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8" />
                        </div>
                        <p className="font-semibold text-slate-900">Click to upload or drag and drop</p>
                        <p className="text-sm text-slate-600">PDF or DOCX (max 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Job Description Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                  <label className="text-lg font-semibold text-slate-900">Paste Job Description</label>
                </div>
                
                <Textarea
                  placeholder="Paste the complete job description here. Include all requirements, responsibilities, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-48 resize-none p-4 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-slate-900 placeholder-slate-400"
                />
                <p className="text-xs text-slate-500 mt-2">
                  💡 Tip: Include the full job posting for the most accurate analysis
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-3 animate-fadeInUp">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !file || !jobDescription.trim()}
                className="w-full gradient-primary text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Resume...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">🔒 Your privacy matters:</span> Your resume and job description are analyzed securely and never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
