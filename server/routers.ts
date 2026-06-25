import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createResume, getUserResumes, createAnalysis, getUserAnalyses } from "./db";
import { parseResumeFile } from "./fileParser";
import { analyzeResume } from "./analysisService";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  resume: router({
    uploadAndAnalyze: protectedProcedure
      .input(
        z.object({
          fileBuffer: z.instanceof(Buffer),
          fileName: z.string(),
          fileType: z.enum(["pdf", "docx"]),
          jobDescription: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const resumeText = await parseResumeFile(input.fileBuffer, input.fileType);
          if (!resumeText || resumeText.trim().length === 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Could not extract text from resume file",
            });
          }

          const fileKey = `resumes/${ctx.user.id}/${Date.now()}-${input.fileName}`;
          const { url: fileUrl } = await storagePut(
            fileKey,
            input.fileBuffer,
            input.fileType === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          );

          const resumeResult = await createResume({
            userId: ctx.user.id,
            fileName: input.fileName,
            fileKey,
            fileUrl,
            fileType: input.fileType,
            resumeText,
          });

          const resumeId = (resumeResult[0]?.insertId as number) || 0;

          const analysis = await analyzeResume(resumeText, input.jobDescription);

          const analysisResult = await createAnalysis({
            userId: ctx.user.id,
            resumeId,
            jobDescription: input.jobDescription,
            atsScore: analysis.atsScore,
            keywordMatchPercentage: analysis.keywordMatchPercentage,
            matchedKeywords: JSON.stringify(analysis.matchedKeywords),
            missingKeywords: JSON.stringify(analysis.missingKeywords),
            improvementSuggestions: JSON.stringify(analysis.improvementSuggestions),
          });

          return {
            success: true,
            resumeId,
            analysisId: (analysisResult[0]?.insertId as number) || 0,
            analysis,
          };
        } catch (error) {
          console.error("Error uploading and analyzing resume:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to analyze resume",
          });
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserResumes(ctx.user.id);
    }),
  }),

  analysis: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const analyses = await getUserAnalyses(ctx.user.id);
      return analyses.map((a) => ({
        ...a,
        matchedKeywords: JSON.parse(a.matchedKeywords),
        missingKeywords: JSON.parse(a.missingKeywords),
        improvementSuggestions: JSON.parse(a.improvementSuggestions),
      }));
    }),

    getById: protectedProcedure
      .input(z.object({ analysisId: z.number() }))
      .query(async ({ ctx, input }) => {
        const analyses = await getUserAnalyses(ctx.user.id);
        const analysis = analyses.find((a) => a.id === input.analysisId);
        if (!analysis) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Analysis not found",
          });
        }
        return {
          ...analysis,
          matchedKeywords: JSON.parse(analysis.matchedKeywords),
          missingKeywords: JSON.parse(analysis.missingKeywords),
          improvementSuggestions: JSON.parse(analysis.improvementSuggestions),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
