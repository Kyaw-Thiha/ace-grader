import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { publicProcedure } from "../trpc";

export const teacherNotificationRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.teacherNotification.findMany({
        where: {
          id: input.id,
        },
      });
    }),

  getByUnread: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.teacherNotification.findMany({
        where: {
          isRead: false,
          profile: {
            userId: ctx.session.user.id,
          },
        },
        orderBy: {
          time: "desc",
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        text: z.string(),
        resource: z.string(),
        profileId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.teacherNotification.create({
        data: {
          text: input.text,
          resource: input.resource,
          isRead: false,
          profileId: input.profileId,
        },
      });
    }),
});
