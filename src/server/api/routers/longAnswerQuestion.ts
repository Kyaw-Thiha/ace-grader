import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@server/api/trpc";

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
        id: z.string(),
        order: z.number(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          order: input.order,
          questionType: "LongAnswerQuestion",
          longAnswerQuestions: {
            create: {
              text: input.text,
              marks: 1,
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
