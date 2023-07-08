import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 request per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const multipleChoiceQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.findFirst({
        where: {
          id: input.id,
        },
        include: {
          choices: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        order: z.number(),
        worksheetId: z.string().optional(),
        publishedWorksheetId: z.string().optional(),
        text: z.string(),
        explanation: z.string().optional(),
        marks: z.number().optional(),
        answer: z.number().optional(),
        choices: z.array(
          z.object({
            index: z.number(),
            text: z.string(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      // let currentOrder = input.order + 1;
      // void ctx.prisma.question.updateMany({
      //   data: {
      //     order: currentOrder;
      //   }
      // })
      return ctx.prisma.question.create({
        data: {
          order: input.order,
          questionType: "MultipleChoiceQuestion",
          worksheetId: input.worksheetId,
          publishedWorksheetId: input.publishedWorksheetId,
          multipleChoiceQuestion: {
            create: {
              text: input.text,
              explanation: input.explanation ?? "",
              marks: input.marks ?? 1,
              answer: input.answer ?? 0,
              choices: {
                create: input.choices,
              },
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
      return ctx.prisma.multipleChoiceQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
        },
      });
    }),

  checkAIRateLimit: protectedProcedure.query(async ({ ctx }) => {
    const { success } = await ratelimit.limit(ctx.userId);

    return success;
  }),

  editExplanation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        explanation: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.update({
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
        answer: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.update({
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
      return ctx.prisma.multipleChoiceQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          marks: input.marks,
        },
      });
    }),

  addChoice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
        index: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestionOption.create({
        data: {
          multipleChoiceQuestionChoiceId: input.id,
          text: input.text,
          index: input.index,
        },
      });
    }),

  editChoice: protectedProcedure
    .input(
      z.object({
        multipleChoiceQuestionOptionId: z.string(),
        text: z.string(),
        index: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestionOption.update({
        where: {
          id: input.multipleChoiceQuestionOptionId,
        },
        data: {
          index: input.index,
          text: input.text,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
