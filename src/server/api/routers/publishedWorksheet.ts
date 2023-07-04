import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const publishedWorksheetRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.findFirst({
        where: {
          id: input.id,
        },
        include: {
          questions: true,
        },
      });
    }),

  getByProfile: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.findMany({
        where: {
          profileId: input.profileId,
        },
      });
    }),

  getCount: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.count({
        where: {
          profileId: input.profileId,
        },
      });
    }),

  getWorksheet: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.findFirst({
        where: {
          id: input.id,
        },
        select: {
          worksheet: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    }),

  getQuestions: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.findFirst({
        where: {
          id: input.id,
        },
        select: {
          title: true,
          totalMarks: true,
          questions: {
            orderBy: {
              order: "asc",
            },
            include: {
              parentQuestion: {
                // 1st Level
                include: {
                  // 2nd Level
                  childrenQuestions: {
                    include: {
                      // 3rd Level
                      childrenQuestions: {
                        include: {
                          // 4th Level
                          childrenQuestions: true,
                        },
                      },
                    },
                  },
                },
              },
              multipleChoiceQuestion: {
                include: {
                  choices: true,
                },
              },
              shortAnswerQuestion: true,
              longAnswerQuestion: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        totalMarks: z.number(),
        version: z.number(),
        profileId: z.string(),
        worksheetId: z.string(),
        questions: z.array(
          z.object({
            order: z.number(),
            questionType: z.union([
              z.literal("MultipleChoiceQuestion"),
              z.literal("ShortAnswerQuestion"),
              z.literal("LongAnswerQuestion"),
            ]),
            multipleChoiceQuestion: z
              .object({
                create: z.object({
                  text: z.string(),
                  explanation: z.string(),
                  marks: z.number(),
                  answer: z.number(),
                  choices: z.object({
                    create: z.array(
                      z.object({
                        index: z.number(),
                        text: z.string(),
                      })
                    ),
                  }),
                }),
              })
              .optional(),
            // shortAnswerQuestion: z
            //   .object({
            //     create: z.object({
            //       text: z.string().optional(),
            //       explanation: z.string().optional(),
            //       marks: z.number(),
            //       answer: z.string().optional(),
            //     }),
            //   })
            //   .optional(),
            longAnswerQuestion: z
              .object({
                create: z.object({
                  text: z.string(),
                  marks: z.number(),
                  markingScheme: z.array(z.string()),
                  explanation: z.string(),
                  sampleAnswer: z.string(),
                }),
              })
              .optional(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.create({
        data: {
          title: input.title,
          status: "PRIVATE",
          totalMarks: input.totalMarks,
          version: input.version,
          profileId: input.profileId,
          worksheetId: input.worksheetId,
          questions: {
            // create: [
            //   {
            //     order: 1,
            //     questionType: "MultipleChoiceQuestion",
            //     multipleChoiceQuestion: {
            //       create: { text: "", explanation: "", marks: 0 },
            //     },
            //   },
            // ],
            create: input.questions,
          },
        },
      });
    }),
});
