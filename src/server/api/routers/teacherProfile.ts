import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const teacherProfileRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teacherProfile.findFirst({
      where: {
        userId: ctx.userId,
      },
    });
  }),

  getWorksheets: protectedProcedure.query(async ({ ctx }) => {
    const fetchWorksheets = () => {
      return ctx.prisma.teacherProfile.findFirst({
        where: {
          userId: ctx.userId,
        },
        select: {
          worksheets: {
            orderBy: { lastEdited: "desc" },
            select: {
              id: true,
              title: true,
              lastEdited: true,
              publishedWorksheets: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
    };

    const profile = await fetchWorksheets();

    if (!profile) {
      await ctx.prisma.teacherProfile.create({
        data: {
          userId: ctx.userId,
        },
      });
      const newProfile = await fetchWorksheets();

      return newProfile;
    }

    return profile;
  }),

  getPublishedWorksheets: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teacherProfile.findMany({
      where: {
        userId: ctx.userId,
      },
      select: {
        publishedWorksheets: {
          orderBy: { createdTime: "desc" },
          select: {
            id: true,
            title: true,
            createdTime: true,
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(z.object({ username: z.string(), userId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.teacherProfile.create({
        data: {
          userId: input.userId,
        },
      });
    }),
});
