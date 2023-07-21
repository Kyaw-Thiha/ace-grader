import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const worksheetRouter = createTRPCRouter({
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
                  images: true,
                },
              },
              shortAnswerQuestion: {
                include: {
                  images: true,
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
    .input(z.object({ title: z.string(), profileId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.worksheet.create({
        data: {
          title: input.title,
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
