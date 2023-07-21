import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { utapi } from "uploadthing/server";

export const imageRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.image.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        caption: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.image.create({
        data: {
          url: input.url,
          caption: input.caption,
        },
      });
    }),

  editCaption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        caption: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.image.update({
        where: {
          id: input.id,
        },
        data: {
          caption: input.caption,
        },
      });
    }),

  deleteUploadOnly: protectedProcedure
    .input(z.object({ id: z.string(), url: z.string() }))
    .mutation(({ input }) => {
      return utapi.deleteFiles(input.url);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await utapi.deleteFiles(input.url);

      return ctx.prisma.image.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
