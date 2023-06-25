import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const longAnswerQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        order: z.number(),
        worksheetId: z.string().optional(),
        publishedWorksheetId: z.string().optional(),
        text: z.string().optional(),
        markingScheme: z.array(z.string()).optional(),
        marks: z.number().optional(),
        sampleAnswer: z.string().optional(),
        explanation: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          order: input.order,
          questionType: "LongAnswerQuestion",
          worksheetId: input.worksheetId,
          publishedWorksheetId: input.publishedWorksheetId,
          longAnswerQuestion: {
            create: {
              text: input.text ?? "",
              marks: input.marks ?? 1,
              markingScheme: input.markingScheme ?? [],
              sampleAnswer: input.sampleAnswer ?? "",
              explanation: input.explanation ?? "",
            },
          },
        },
      });
    }),

  editText: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
        },
      });
    }),

  editMarkingScheme: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        markingScheme: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          markingScheme: input.markingScheme,
        },
      });
    }),

  editExplanation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        explanation: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          explanation: input.explanation,
        },
      });
    }),

  editSampleAnswer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        sampleAnswer: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          sampleAnswer: input.sampleAnswer,
        },
      });
    }),

  editMarks: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        marks: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          marks: input.marks,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
