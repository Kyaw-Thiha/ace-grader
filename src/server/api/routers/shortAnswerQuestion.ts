import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@server/api/trpc";

export const shortAnswerQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.shortAnswerQuestion.findFirst({
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
          questionType: "ShortAnswerQuestion",
          shortAnswerQuestion: {
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
      return ctx.prisma.shortAnswerQuestion.update({
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
      return ctx.prisma.shortAnswerQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          explanation: input.explanation,
        },
      });
    }),

  editAnswer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        answer: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shortAnswerQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          answer: input.answer,
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
      return ctx.prisma.shortAnswerQuestion.update({
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
      return ctx.prisma.shortAnswerQuestion.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
