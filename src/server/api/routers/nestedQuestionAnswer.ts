import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const nestedQuestionAnswerRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.nestedQuestionAnswer.findFirst({
        where: {
          id: input.id,
        },
        include: {
          // 2nd level (a)
          //   images: true,
          childrenAnswers: {
            include: {
              multipleChoiceQuestionAnswer: true,
              openEndedQuestionAnswer: true,
              essayAnswer: {
                include: {
                  criteria: true,
                  properties: true,
                },
              },
              nestedQuestionAnswer: {
                include: {
                  // 3rd level (i)
                  //   images: true,
                  childrenAnswers: {
                    include: {
                      multipleChoiceQuestionAnswer: true,
                      openEndedQuestionAnswer: true,
                      essayAnswer: {
                        include: {
                          criteria: true,
                          properties: true,
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

  create: protectedProcedure
    .input(
      z.object({
        order: z.number(),
        worksheetId: z.string().optional(),
        publishedWorksheetId: z.string().optional(),
        parentId: z.string().optional(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          order: input.order,
          questionType: "NestedQuestion",
          worksheetId: input.worksheetId,
          publishedWorksheetId: input.publishedWorksheetId,
          parentId: input.parentId,
          nestedQuestion: {
            create: {
              text: input.text,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.nestedQuestionAnswer.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
