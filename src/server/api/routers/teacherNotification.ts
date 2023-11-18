import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { publicProcedure } from "../trpc";
import { pusherServer } from "@/server/pusher";

export const teacherNotificationRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.teacherNotification.findMany({
        where: {
          id: input.id,
        },
      });
    }),

  get15Latest: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.teacherNotification.findMany({
        where: {
          profile: {
            userId: ctx.userId,
          },
        },
        orderBy: {
          time: "desc",
        },
        take: 15,
      });
    }),

  marklast15Read: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.teacherNotification.updateMany({
        where: {
          profile: {
            userId: ctx.userId,
          },
        },
        data: {
          isRead: true,
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
            userId: ctx.userId,
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
    .mutation(async ({ ctx, input }) => {
      console.log(input.profileId);
      void pusherServer.trigger(
        `teacher-${input.profileId}`,
        "notification",
        input.text
      );

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
