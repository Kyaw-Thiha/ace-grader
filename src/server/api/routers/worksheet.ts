import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const worksheetRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.worksheet.findMany();
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.worksheet.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  getByProfile: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.worksheet.findMany({
        where: {
          profileId: input.profileId,
        },
        orderBy: {
          lastEdited: "desc",
        },
      });
    }),

  getQuestions: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.worksheet.findFirst({
        where: {
          id: input.id,
        },
        select: {
          questions: {
            orderBy: {
              order: "asc",
            },
            include: {
              nestedQuestion: {
                include: {
                  // 1st level (1)
                  images: true,
                  childrenQuestions: {
                    include: {
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
                          // 2nd level (a)
                          images: true,
                          childrenQuestions: {
                            include: {
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
              shortAnswerQuestion: {
                include: {
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
      });
    }),

  getPublishedWorksheetLatestVersion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.worksheet.findFirst({
        where: {
          id: input.id,
        },
        select: {
          publishedWorksheets: {
            orderBy: {
              version: "desc",
            },
            take: 1,
          },
        },
      });
    }),

  getFinishedAnswerSheets: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.worksheet.findFirst({
        where: {
          id: input.id,
        },
        select: {
          publishedWorksheets: {
            orderBy: {
              version: "desc",
            },
            include: {
              answerSheets: {
                orderBy: {
                  startTime: "desc",
                },
                where: {
                  OR: [{ status: "checking" }, { status: "returned" }],
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
        profileId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.worksheet.create({
        data: {
          title: input.title,
          country: input.country,
          curriculum: input.curriculum,
          subject: input.subject,
          profileId: input.profileId,
        },
      });
    }),

  editTitle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.worksheet.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
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
      return ctx.prisma.worksheet.update({
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

  editProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        profileId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.worksheet.update({
        where: {
          id: input.id,
        },
        data: {
          profile: {
            connect: { id: input.profileId },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.worksheet.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
