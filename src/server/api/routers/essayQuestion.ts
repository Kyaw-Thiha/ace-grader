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
          questionType: "NestedQuestion",
          worksheetId: input.worksheetId,
          publishedWorksheetId: input.publishedWorksheetId,
          parentId: input.parentId,
          essayQuestion: {
            create: {
              text: input.text ?? "",
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

  editGrammar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        grammar: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          grammar: input.grammar,
        },
      });
    }),

  editFocus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        focus: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          focus: input.focus,
        },
      });
    }),

  editExposition: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        exposition: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          exposition: input.exposition,
        },
      });
    }),

  editOrganization: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        organization: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          organization: input.organization,
        },
      });
    }),

  editPlot: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        plot: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          plot: input.plot,
        },
      });
    }),

  editNarrativeTechniques: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        narrativeTechniques: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          narrative_techniques: input.narrativeTechniques,
        },
      });
    }),

  editVocabulary: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        grammar: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          grammar: input.grammar,
        },
      });
    }),

  editContent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
    }),

  editContentPoints: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        contentPoints: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          content_points: input.contentPoints,
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
