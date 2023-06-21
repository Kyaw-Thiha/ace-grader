import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
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
