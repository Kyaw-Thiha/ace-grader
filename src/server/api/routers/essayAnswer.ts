import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const essayAnswerRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.essayAnswer.findFirst({
        where: {
          id: input.id,
        },
        include: {
          criteria: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        order: z.number(),
        answerSheetId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.create({
        data: {
          order: input.order,
          answerType: "EssayAnswer",
          answerSheetId: input.answerSheetId,
          essayAnswer: {
            create: {
              studentAnswer: "",
              overallImpression: "",
              criteria: {
                create: [
                  {
                    name: "Grammar",
                    evaluation: "",
                    suggestion: "",
                  },
                  {
                    name: "Focus",
                    evaluation: "",
                    suggestion: "",
                  },
                  {
                    name: "Exposition",
                    evaluation: "",
                    suggestion: "",
                  },
                  {
                    name: "Organization",
                    evaluation: "",
                    suggestion: "",
                  },
                  {
                    name: "Plot",
                    evaluation: "",
                    suggestion: "",
                  },
                  {
                    name: "Narrative Techniques",
                    evaluation: "",
                    suggestion: "",
                  },
                  {
                    name: "Language and Vocabulary",
                    evaluation: "",
                    suggestion: "",
                  },
                  {
                    name: "Content",
                    evaluation: "",
                    suggestion: "",
                  },
                ],
              },
            },
          },
        },
      });
    }),

  editAnswer: publicProcedure
    .input(
      z.object({
        id: z.string(),
        studentAnswer: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayAnswer.update({
        where: {
          id: input.id,
        },
        data: {
          studentAnswer: input.studentAnswer,
        },
      });
    }),

  editCriteria: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        marks: z.number(),
        evaluation: z.string(),
        suggestion: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayAnswerCriteria.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          marks: input.marks,
          evaluation: input.evaluation,
          suggestion: input.suggestion,
        },
      });
    }),

  editOverallImpression: publicProcedure
    .input(
      z.object({
        id: z.string(),
        overallImpression: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayAnswer.update({
        where: {
          id: input.id,
        },
        data: {
          overallImpression: input.overallImpression,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayAnswer.delete({
        where: {
          id: input.id,
        },
      });
    }),
});