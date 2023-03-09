import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";

export const publishedWorksheetRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.findMany({
        where: {
          id: input.id,
        },
      });
    }),

  getByProfile: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.findMany({
        where: {
          profileId: input.profileId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        profileId: z.string(),
        worksheetId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.publishedWorksheet.create({
        data: {
          title: input.title,
          status: "PRIVATE",
          totalMarks: 0,
          profileId: input.profileId,
          worksheetId: input.worksheetId,
        },
      });
    }),
});
