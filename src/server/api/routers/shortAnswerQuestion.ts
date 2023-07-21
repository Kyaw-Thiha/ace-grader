import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const shortAnswerQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.shortAnswerQuestion.findFirst({
        where: {
          id: input.id,
        },
        include: {
          images: true,
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
        explanation: z.string().optional(),
        marks: z.number().optional(),
        answer: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          order: input.order,
          questionType: "ShortAnswerQuestion",
          worksheetId: input.worksheetId,
          publishedWorksheetId: input.publishedWorksheetId,
          shortAnswerQuestion: {
            create: {
              text: input.text ?? "",
              marks: input.marks ?? 1,
              answer: input.answer ?? "",
              explanation: input.explanation ?? "",
            },
          },
        },
      });
    }),

  addImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        url: z.string(),
        caption: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          images: {
            create: {
              url: input.url,
              caption: input.caption,
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
