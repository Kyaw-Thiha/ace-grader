import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const openEndedQuestionAnswerRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.openEndedQuestionAnswer.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        order: z.number(),
        answerSheetId: z.string(),
        studentAnswer: z.string(),
        // studentImages: z.array(
        //   z.object({ url: z.string(), caption: z.string() })
        // ),
        feedback: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.create({
        data: {
          order: input.order,
          answerType: "OpenEndedQuestionAnswer",
          answerSheetId: input.answerSheetId,
          openEndedQuestionAnswer: {
            create: {
              studentAnswer: input.studentAnswer,
              // studentImages: {
              //   create: input.studentImages,
              // },
              feedback: input.feedback ?? "",
            },
          },
        },
      });
    }),

  editAnswer: publicProcedure
    .input(
      z.object({
        id: z.string(),
        studentAnswer: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.openEndedQuestionAnswer.update({
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
      return ctx.prisma.openEndedQuestionAnswer.update({
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
      return ctx.prisma.openEndedQuestionAnswer.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
