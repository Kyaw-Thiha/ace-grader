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

export const longAnswerQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.longAnswerQuestion.findFirst({
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

  checkAIRateLimit: protectedProcedure.query(async ({ ctx }) => {
    const { success } = await ratelimit.limit(ctx.userId);
    console.log(success);

    return success;
  }),

  editExplanation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        explanation: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
