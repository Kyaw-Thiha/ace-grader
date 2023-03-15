import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";

export const worksheetRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.worksheet.findMany({
        where: {
          id: input.id,
        },
      });
    }),

  getByProfile: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.worksheet.findMany({
        where: {
          profileId: input.profileId,
        },
        orderBy: {
          lastEdited: "desc",
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string(), profileId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.worksheet.create({
        data: {
          title: input.title,
          profileId: input.profileId,
        },
      });
    }),
});
