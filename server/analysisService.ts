import { invokeLLM } from "./_core/llm";

interface AnalysisResult {
  atsScore: number;
  keywordMatchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  improvementSuggestions: Array<{
    category: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }>;
}

/**
 * Analyze resume against job description using AI
 */
export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  try {
    // First, extract keywords and requirements from job description
    const keywordAnalysis = await extractKeywords(resumeText, jobDescription);
    
    // Then, get ATS score and improvement suggestions
    const atsAnalysis = await getATSScore(resumeText, jobDescription);
    
    return {
      atsScore: atsAnalysis.atsScore,
      keywordMatchPercentage: keywordAnalysis.matchPercentage,
      matchedKeywords: keywordAnalysis.matched,
      missingKeywords: keywordAnalysis.missing,
      improvementSuggestions: atsAnalysis.suggestions,
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume");
  }
}

/**
 * Extract and match keywords between resume and job description
 */
async function extractKeywords(
  resumeText: string,
  jobDescription: string
): Promise<{
  matched: string[];
  missing: string[];
  matchPercentage: number;
}> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "You are an expert ATS analyst. Extract key skills from job description and compare with resume.",
      },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "keyword_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            matched: {
              type: "array",
              items: { type: "string" },
            },
            missing: {
              type: "array",
              items: { type: "string" },
            },
            matchPercentage: {
              type: "integer",
            },
          },
          required: ["matched", "missing", "matchPercentage"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error("No response from LLM");

  const contentStr = typeof content === "string" ? content : JSON.stringify(content);
  const parsed = JSON.parse(contentStr);
  return {
    matched: parsed.matched || [],
    missing: parsed.missing || [],
    matchPercentage: Math.min(100, Math.max(0, parsed.matchPercentage || 0)),
  };
}

/**
 * Get ATS score and improvement suggestions
 */
async function getATSScore(
  resumeText: string,
  jobDescription: string
): Promise<{
  atsScore: number;
  suggestions: Array<{
    category: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }>;
}> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "You are an ATS specialist. Analyze resume and provide improvement suggestions.",
      },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "ats_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            atsScore: {
              type: "integer",
            },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                  },
                  suggestion: {
                    type: "string",
                  },
                  priority: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                  },
                },
                required: ["category", "suggestion", "priority"],
                additionalProperties: false,
              },
            },
          },
          required: ["atsScore", "suggestions"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error("No response from LLM");

  const contentStr = typeof content === "string" ? content : JSON.stringify(content);
  const parsed = JSON.parse(contentStr);
  return {
    atsScore: Math.min(100, Math.max(0, parsed.atsScore || 0)),
    suggestions: parsed.suggestions || [],
  };
}
