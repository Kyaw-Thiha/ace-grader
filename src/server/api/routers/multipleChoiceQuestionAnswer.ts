import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@server/api/trpc";

export const multipleChoiceQuestionAnswerRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestionAnswer.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        order: z.number(),
        answerSheetId: z.string(),
        studentAnswer: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.create({
        data: {
          order: input.order,
          answerType: "MultipleChoiceQuestionAnswer",
          answerSheetId: input.answerSheetId,
          multipleChoiceQuestionAnswer: {
            create: {
              studentAnswer: input.studentAnswer,
            },
          },
        },
      });
    }),

  editAnswer: publicProcedure
    .input(
      z.object({
        id: z.string(),
        studentAnswer: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestionAnswer.update({
        where: {
          id: input.id,
        },
        data: {
          studentAnswer: input.studentAnswer,
        },
      });
    }),

  editFeedback: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        feedback: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestionAnswer.update({
        where: {
          id: input.id,
        },
        data: {
          feedback: input.feedback,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestionAnswer.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
