import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@server/api/trpc";

export const multipleChoiceQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        order: z.number(),
        text: z.string().optional(),
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
      return ctx.prisma.question.create({
        data: {
          order: input.order,
          questionType: "MultipleChoiceQuestion",
          multipleChoiceQuestion: {
            create: {
              text: input.text ?? "",
              explanation: input.explanation ?? "",
              marks: input.marks ?? 1,
              answer: input.answer ?? 0,
              choices: {
                create: input.choices,
              },
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
      return ctx.prisma.multipleChoiceQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
        },
      });
    }),

  editExplanation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        explanation: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          explanation: input.explanation,
        },
      });
    }),

  editAnswer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        answer: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          answer: input.answer,
        },
      });
    }),

  editMarks: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        marks: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          marks: input.marks,
        },
      });
    }),

  addChoice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
        index: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestionOption.create({
        data: {
          multipleChoiceQuestionChoiceId: input.id,
          text: input.text,
          index: input.index,
        },
      });
    }),

  editChoice: protectedProcedure
    .input(
      z.object({
        multipleChoiceQuestionOptionId: z.string(),
        text: z.string(),
        index: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestionOption.update({
        where: {
          id: input.multipleChoiceQuestionOptionId,
        },
        data: {
          index: input.index,
          text: input.text,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.multipleChoiceQuestion.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
