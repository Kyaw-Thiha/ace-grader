import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const essayQuestionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.findFirst({
        where: {
          id: input.id,
        },
        include: {
          criteria: true,
          images: true,
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
        text: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          order: input.order,
          questionType: "EssayQuestion",
          worksheetId: input.worksheetId,
          publishedWorksheetId: input.publishedWorksheetId,
          parentId: input.parentId,
          essayQuestion: {
            create: {
              text: input.text ?? "",
              criteria: {
                create: [
                  {
                    name: "Grammar",
                    marks: 0,
                  },
                  {
                    name: "Focus",
                    marks: 0,
                  },
                  {
                    name: "Exposition",
                    marks: 0,
                  },
                  {
                    name: "Organization",
                    marks: 0,
                  },
                  {
                    name: "Plot",
                    marks: 0,
                  },
                  {
                    name: "Narrative Techniques",
                    marks: 0,
                  },
                  {
                    name: "Language and Vocabulary",
                    marks: 0,
                  },
                  {
                    name: "Content",
                    marks: 0,
                  },
                ],
              },
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
      return ctx.prisma.essayQuestion.update({
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
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
        },
      });
    }),

  editCriteria: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.union([
          z.literal("Grammar"),
          z.literal("Focus"),
          z.literal("Exposition"),
          z.literal("Organization"),
          z.literal("Plot"),
          z.literal("Narrative Techniques"),
          z.literal("Language and Vocabulary"),
          z.literal("Content"),
        ]),
        marks: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestionCriteria.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          marks: input.marks,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
