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
        answers: z.array(
          z.object({
            order: z.number(),
            answerType: z.union([
              z.literal("MultipleChoiceQuestionAnswer"),
              z.literal("ShortAnswerQuestionAnswer"),
              z.literal("LongAnswerQuestionAnswer"),
            ]),
            multipleChoiceQuestionAnswer: z
              .object({
                create: z.object({
                  studentAnswer: z.number(),
                }),
              })
              .optional(),
            shortAnswerQuestionAnswer: z
              .object({
                create: z.object({
                  studentAnswer: z.string(),
                }),
              })
              .optional(),
            LongAnswerQuestionAnswer: z
              .object({
                create: z.object({
                  studentAnswer: z.string(),
                  studentImage: z.string(),
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
