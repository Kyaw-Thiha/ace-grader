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
          properties: true,
        },
      });
    }),

  getEssayAnswerCriteria: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.essayAnswerCriteria.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        order: z.number(),
        answerSheetId: z.string(),
        criteria: z.array(
          z.object({
            name: z.string(),
            evaluation: z.string(),
            suggestion: z.string(),
            level: z.string(),
          })
        ),
        properties: z.array(
          z.object({
            name: z.string(),
            text: z.string(),
          })
        ),
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
              criteria: {
                create: input.criteria,
              },
              properties: {
                create: input.properties,
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
        // name: z.union([
        //   z.literal("Grammar"),
        //   z.literal("Focus"),
        //   z.literal("Exposition"),
        //   z.literal("Organization"),
        //   z.literal("Sentence Structure "),
        //   z.literal("Plot"),
        //   z.literal("Narrative Techniques"),
        //   z.literal("Descriptive Techniques"),
        //   z.literal("Literary Devices"),
        //   z.literal("Language and Vocabulary"),
        //   z.literal("Content"),
        //   z.literal("Persuasion"),
        //   z.literal("Purpose"),
        //   z.literal("Register"),
        // ]),
        name: z.string(),
        marks: z.number(),
        evaluation: z.string(),
        level: z.string(),
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
          level: input.level,
          suggestion: input.suggestion,
        },
      });
    }),

  editCriteriaAnswer: publicProcedure
    .input(
      z.object({
        id: z.string(),
        marks: z.number(),
        evaluation: z.string(),
        level: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayAnswerCriteria.update({
        where: {
          id: input.id,
        },
        data: {
          marks: input.marks,
          evaluation: input.evaluation,
          level: input.level,
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
