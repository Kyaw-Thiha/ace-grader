import { z } from "zod";
import { customAlphabet } from "nanoid";

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
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.publishedWorksheet.findMany();
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.findFirst({
        where: {
          id: input.id,
        },
        include: {
          questions: {
            include: {
              multipleChoiceQuestion: {
                include: {
                  choices: true,
                  images: true,
                },
              },
              openEndedQuestion: {
                include: {
                  images: true,
                },
              },
              essayQuestion: {
                include: {
                  criteria: true,
                  images: true,
                },
              },
              // 2nd level
              nestedQuestion: {
                include: {
                  images: true,
                  childrenQuestions: {
                    include: {
                      multipleChoiceQuestion: {
                        include: {
                          choices: true,
                          images: true,
                        },
                      },
                      openEndedQuestion: {
                        include: {
                          images: true,
                        },
                      },
                      essayQuestion: {
                        include: {
                          criteria: true,
                          images: true,
                        },
                      },
                      // 3rd level
                      nestedQuestion: {
                        include: {
                          images: true,
                          childrenQuestions: {
                            include: {
                              multipleChoiceQuestion: {
                                include: {
                                  choices: true,
                                  images: true,
                                },
                              },
                              openEndedQuestion: {
                                include: {
                                  images: true,
                                },
                              },
                              essayQuestion: {
                                include: {
                                  criteria: true,
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
            },
          },
        },
      });
    }),

  checkForCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.findFirst({
        where: {
          code: input.code,
        },
        select: {
          id: true,
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
          profileId: true,
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
                      openEndedQuestion: {
                        include: {
                          images: true,
                        },
                      },
                      essayQuestion: {
                        include: {
                          criteria: true,
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
                              openEndedQuestion: {
                                include: {
                                  images: true,
                                },
                              },
                              essayQuestion: {
                                include: {
                                  criteria: true,
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
              openEndedQuestion: { include: { images: true } },
              essayQuestion: {
                include: {
                  criteria: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        country: z.string(),
        curriculum: z.string(),
        subject: z.string(),
        totalMarks: z.number(),
        version: z.number(),
        profileId: z.string(),
        worksheetId: z.string(),
        questions: z.array(
          z.object({
            // 1st level
            ...questionSchemaProperties,
            nestedQuestion: z
              .object({
                create: z.object({
                  ...nestedQuestionSchemaProperties,
                  childrenQuestions: z.object({
                    create: z.array(
                      z.object({
                        // 2nd level
                        ...questionSchemaProperties,
                        nestedQuestion: z
                          .object({
                            create: z.object({
                              ...nestedQuestionSchemaProperties,
                              childrenQuestions: z.object({
                                create: z.array(
                                  z.object({
                                    // 3rd level
                                    ...questionSchemaProperties,
                                  })
                                ),
                              }),
                            }),
                          })
                          .optional(),
                      })
                    ),
                  }),
                }),
              })
              .optional(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      const nanoid = customAlphabet(
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        12
      );

      return ctx.prisma.publishedWorksheet.create({
        data: {
          title: input.title,
          country: input.country,
          curriculum: input.curriculum,
          subject: input.subject,
          status: "PRIVATE",
          totalMarks: input.totalMarks,
          version: input.version,
          code: nanoid(),
          profileId: input.profileId,
          worksheetId: input.worksheetId,
          questions: {
            create: input.questions,
          },
        },
      });
    }),

  editCourse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        country: z.string(),
        curriculum: z.string(),
        subject: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.update({
        where: {
          id: input.id,
        },
        data: {
          country: input.country,
          curriculum: input.curriculum,
          subject: input.subject,
        },
      });
    }),

  editTotalMarks: publicProcedure
    .input(
      z.object({
        id: z.string(),
        totalMarks: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.update({
        where: {
          id: input.id,
        },
        data: {
          totalMarks: input.totalMarks,
        },
      });
    }),
});
