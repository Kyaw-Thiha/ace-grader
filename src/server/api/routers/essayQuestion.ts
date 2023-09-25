import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const essayQuestionRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.essayQuestion.findMany({
      include: {
        criteria: true,
        images: true,
      },
    });
  }),

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

  getAllCriteria: publicProcedure.query(({ ctx, input }) => {
    return ctx.prisma.essayQuestionCriteria.findMany({});
  }),

  create: protectedProcedure
    .input(
      z.object({
        order: z.number(),
        worksheetId: z.string().optional(),
        publishedWorksheetId: z.string().optional(),
        parentId: z.string().optional(),
        text: z.string().optional(),
        essayType: z.string(),
        criteria: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
            marks: z.number(),
          })
        ),
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
              essayType: input.essayType,
              criteria: {
                // create: [
                //   {
                //     name: "Grammar",
                //     description:
                //       "Evaluate the essay's grammatical accuracy, sentence structure, and proper use of punctuation and spelling.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Focus",
                //     description:
                //       "Assess whether the essay maintains a clear and consistent focus on the chosen topic or subject matter. Consider whether the essay stays on point throughout.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Exposition",
                //     description:
                //       "Evaluate the effectiveness of the introduction in capturing the reader's attention and providing necessary context for the essay's content.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Organization",
                //     description:
                //       "Assess the logical flow and organization of ideas within the essay. Consider the coherence of paragraphs and transitions between different sections.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Sentence Structure",
                //     description:
                //       "Assess the variety and effectiveness of sentence structures and syntax used in the essay. Consider the balance between simple and complex sentences, and evaluate how well the syntax contributes to the essay's readability and engagement.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Plot",
                //     description:
                //       "If applicable, evaluate the development and coherence of the essay's plot or storyline. Consider its relevance to the overall theme and how well it engages the reader.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Narrative Techniques",
                //     description:
                //       "Analyze the essay's use of narrative techniques, such as imagery, dialogue, and descriptive language, to enhance the storytelling and reader's experience.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Descriptive Techniques",
                //     description:
                //       "Analyze the use of rich and evocative language, sensory details, and the ability to paint a clear mental picture for the reader. Consider how these techniques contribute to the depth, atmosphere, and immersive quality of the descriptive elements in the writing.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Literary Devices",
                //     description:
                //       "Evaluate the incorporation of literary devices like similes, metaphors, and other figurative language in the essay. Assess their relevance, impact, and contribution to the overall quality of the writing.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Language and Vocabulary",
                //     description:
                //       "Evaluate the richness and appropriateness of the language used. Consider the diversity of vocabulary and its contribution to the overall quality of the essay.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Content",
                //     description:
                //       "Assess the depth and accuracy of the essay's content in relation to the chosen topic. Consider whether the essay demonstrates a comprehensive understanding of the subject matter.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Persuasion",
                //     description:
                //       "Evaluate the essay's ability to persuade and convince the reader in argumentative or persuasive writings. Analyze the strength of the arguments presented, the use of evidence, and the logical progression of ideas.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Purpose",
                //     description:
                //       "Assess the awareness of the essay's form, intended audience, and purpose. Consider how well the writing aligns with the chosen form and effectively communicates with the target audience while fulfilling the intended purpose.",
                //     marks: 0,
                //   },
                //   {
                //     name: "Register",
                //     description:
                //       "Evaluate the use of appropriate language register in the essay. Assess whether the level of formality or informality is suitable for the intended audience and purpose, and whether it enhances the overall communication.",
                //     marks: 0,
                //   },
                // ],
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

  editEssayType: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        essayType: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestion.update({
        where: {
          id: input.id,
        },
        data: {
          essayType: input.essayType,
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
        description: z.string(),
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
          description: input.description,
          marks: input.marks,
        },
      });
    }),

  editCriteriaDescription: publicProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.essayQuestionCriteria.update({
        where: {
          id: input.id,
        },
        data: {
          description: input.description,
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
