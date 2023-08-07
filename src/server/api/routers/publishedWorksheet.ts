import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  questionSchemaProperties,
  nestedQuestionSchemaProperties,
} from "@/server/api/schema";

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
    .input(z.object({ worksheetId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.count({
        where: {
          worksheetId: input.worksheetId,
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
              nestedQuestion: {
                // 1st Level
                include: {
                  images: true,
                  childrenQuestions: {
                    include: {
                      // 2nd Level
                      multipleChoiceQuestion: {
                        include: {
                          images: true,
                          choices: true,
                        },
                      },
                      longAnswerQuestion: {
                        include: {
                          images: true,
                        },
                      },
                      nestedQuestion: {
                        include: {
                          images: true,
                          childrenQuestions: {
                            include: {
                              // 3rd Level
                              multipleChoiceQuestion: {
                                include: {
                                  images: true,
                                  choices: true,
                                },
                              },
                              longAnswerQuestion: {
                                include: {
                                  images: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              multipleChoiceQuestion: {
                include: {
                  choices: true,
                  images: true,
                },
              },
              shortAnswerQuestion: { include: { images: true } },
              longAnswerQuestion: { include: { images: true } },
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
            ...questionSchemaProperties,
            nestedQuestion: z
              .object({
                // 1st level
                create: z.object({
                  ...nestedQuestionSchemaProperties,
                  childrenQuestions: z
                    .object({
                      // 2nd level
                      create: z.array(
                        z.object({
                          ...questionSchemaProperties,
                          create: z.object({
                            ...nestedQuestionSchemaProperties,
                            childrenQuestions: z
                              .object({
                                // 3rd level
                                create: z.array(
                                  z.object({
                                    ...questionSchemaProperties,
                                    create: z.object({
                                      ...nestedQuestionSchemaProperties,
                                      childrenQuestions: z
                                        .object({
                                          // 4th level
                                          create: z.array(
                                            z.object({
                                              ...questionSchemaProperties,
                                            })
                                          ),
                                        })
                                        .optional(),
                                    }),
                                  })
                                ),
                              })
                              .optional(),
                          }),
                        })
                      ),
                    })
                    .optional(),
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
            create: input.questions,
          },
        },
      });
    }),
});
