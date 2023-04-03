import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";

export const answerSheetRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.answerSheet.findFirst({
        where: {
          id: input.id,
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
              parentQuestions: {
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
        studentName: z.string(),
        studentEmail: z.string(),
        publishedWorksheetId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answerSheet.create({
        data: {
          studentName: input.studentName,
          studentEmail: input.studentEmail,
          publishedWorksheetId: input.publishedWorksheetId,
        },
      });
    }),

  editStudentName: protectedProcedure
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

  editStudentEmail: protectedProcedure
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answerSheet.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
