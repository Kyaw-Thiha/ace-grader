import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.object({})).query(({ ctx, input }) => {
    return ctx.prisma.question.findMany({});
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.question.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  getQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.question.findFirst({
        where: {
          id: input.id,
        },
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
      });
    }),

  editOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        order: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: {
          id: input.id,
        },
        data: {
          order: input.order,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
