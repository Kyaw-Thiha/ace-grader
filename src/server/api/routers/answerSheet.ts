import { z } from "zod";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import checkAnswer from "@/defer/checkAnswer";
import { TRPCError } from "@trpc/server";

// Create a new ratelimiter, that allows 1 request per 1 minute
const checkAnswerRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const answerSheetRouter = createTRPCRouter({
  getAllLongAnswerQuestionAnswers: publicProcedure.query(({ ctx, input }) => {
    return ctx.prisma.answer.findMany({
      where: {
        answerType: "LongAnswerQuestionAnswer",
      },
      include: {
        longAnswerQuestionAnswer: true,
      },
    });
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.answerSheet.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  getCurrentAnswerSheet: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.answerSheet.findFirst({
        where: {
          studentEmail: input.email,
          status: "answering",
        },
        orderBy: {
          startTime: "desc",
        },
      });
    }),

  getReturnedAnswerSheetByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.answerSheet.findMany({
        where: {
          studentEmail: input.email,
          status: "returned",
        },
        orderBy: {
          startTime: "desc",
        },
      });
    }),

  getAnswers: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.answerSheet.findFirst({
        where: {
          id: input.id,
        },
        select: {
          studentName: true,
          studentEmail: true,
          status: true,
          totalMarks: true,
          startTime: true,
          endTime: true,
          answers: {
            orderBy: {
              order: "asc",
            },
            include: {
              multipleChoiceQuestionAnswer: true,
              shortAnswerQuestionAnswer: true,
              openEndedQuestionAnswer: true,
            },
          },
        },
      });
    }),

  checkPassword: publicProcedure
    .input(z.object({ id: z.string(), passwordHash: z.string() }))
    .query(({ ctx, input }) => {
      ctx.prisma.answerSheet
        .findFirst({
          where: {
            id: input.id,
          },
        })
        .then((answerSheet) => {
          return answerSheet?.studentPassword == input.passwordHash;
        })
        .catch(() => {
          return;
        });
    }),

  create: publicProcedure
    .input(
      z.object({
        studentName: z.string(),
        studentEmail: z.string(),
        publishedWorksheetId: z.string(),
        answers: z.array(
          z.object({
            order: z.number(),
            answerType: z.union([
              z.literal("MultipleChoiceQuestionAnswer"),
              z.literal("ShortAnswerQuestionAnswer"),
              z.literal("OpenEndedQuestionAnswer"),
            ]),
            multipleChoiceQuestionAnswer: z
              .object({
                create: z.object({
                  studentAnswer: z.number(),
                  feedback: z.string(),
                }),
              })
              .optional(),
            shortAnswerQuestionAnswer: z
              .object({
                create: z.object({
                  studentAnswer: z.string(),
                  feedback: z.string(),
                }),
              })
              .optional(),
            openEndedQuestionAnswer: z
              .object({
                create: z.object({
                  studentAnswer: z.string(),
                  // studentImages: z.array(
                  //   z.object({
                  //     urL: z.string(),
                  //     caption: z.string(),
                  //   })
                  // ),
                  feedback: z.string(),
                }),
              })
              .optional(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answerSheet.create({
        data: {
          studentName: input.studentName,
          studentEmail: input.studentEmail,
          status: "answering",
          publishedWorksheetId: input.publishedWorksheetId,
          answers: {
            create: input.answers,
          },
        },
      });
    }),

  editStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.union([
          z.literal("answering"),
          z.literal("checking"),
          z.literal("returned"),
        ]),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answerSheet.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),

  editStudentName: publicProcedure
    .input(
      z.object({
        id: z.string(),
        studentName: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answerSheet.update({
        where: {
          id: input.id,
        },
        data: {
          studentName: input.studentName,
        },
      });
    }),

  editStudentEmail: publicProcedure
    .input(
      z.object({
        id: z.string(),
        studentEmail: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answerSheet.update({
        where: {
          id: input.id,
        },
        data: {
          studentEmail: input.studentEmail,
        },
      });
    }),

  setEndTime: publicProcedure
    .input(
      z.object({
        id: z.string(),
        endTime: z.date(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answerSheet.update({
        where: {
          id: input.id,
        },
        data: {
          endTime: input.endTime,
        },
      });
    }),

  checkAnswer: publicProcedure
    .input(
      z.object({
        worksheetId: z.string(),
        answerSheetId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await checkAnswerRateLimit.limit(input.answerSheetId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      return checkAnswer(input.worksheetId, input.answerSheetId);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answerSheet.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
