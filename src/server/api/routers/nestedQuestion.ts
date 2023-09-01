import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const nestedQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.nestedQuestion.findFirst({
        where: {
          id: input.id,
        },
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
              nestedQuestion: {
                include: {
                  // 3rd level (i)
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
                          // 4th level (1)
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

  addImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        url: z.string(),
        fileKey: z.string(),
        caption: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.nestedQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          images: {
            create: {
              url: input.url,
              fileKey: input.fileKey,
              caption: input.caption,
            },
          },
        },
      });
    }),

  editText: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.nestedQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
        },
      });
    }),

  addNestedQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        order: z.number(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.nestedQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          childrenQuestions: {
            create: {
              order: input.order,
              questionType: "NestedQuestion",
              nestedQuestion: {
                create: {
                  text: input.text,
                },
              },
            },
          },
        },
      });
    }),

  addMultipleChoiceQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        order: z.number(),
        text: z.string(),
        explanation: z.string().optional(),
        marks: z.number().optional(),
        answer: z.number().optional(),
        choices: z.array(
          z.object({
            index: z.number(),
            text: z.string(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.nestedQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          childrenQuestions: {
            create: {
              order: input.order,
              questionType: "MultipleChoiceQuestion",
              multipleChoiceQuestion: {
                create: {
                  text: input.text,
                  explanation: input.explanation ?? "",
                  marks: input.marks ?? 1,
                  answer: input.answer ?? 0,
                  choices: {
                    create: input.choices,
                  },
                },
              },
            },
          },
        },
      });
    }),

  addOpenEndedQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        order: z.number(),
        text: z.string().optional(),
        markingScheme: z.array(z.string()).optional(),
        marks: z.number().optional(),
        sampleAnswer: z.string().optional(),
        explanation: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.nestedQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          childrenQuestions: {
            create: {
              order: input.order,
              questionType: "OpenEndedQuestion",
              openEndedQuestion: {
                create: {
                  text: input.text ?? "",
                  marks: input.marks ?? 1,
                  markingScheme: input.markingScheme ?? [],
                  sampleAnswer: input.sampleAnswer ?? "",
                  explanation: input.explanation ?? "",
                },
              },
            },
          },
        },
      });
    }),

  deleteNestedChildren: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.deleteMany({
        where: {
          parent: { question: { parent: { questionId: input.id } } },
        },
      });
    }),

  deleteChildren: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.deleteMany({
        where: {
          parent: { questionId: input.id },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.nestedQuestion.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
