import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const teacherProfileRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teacherProfile.findFirst({
      where: {
        email: ctx.user?.emailAddresses[0]?.emailAddress,
      },
    });
  }),

  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teacherProfile.findFirst({
      where: {
        email: ctx.user?.emailAddresses[0]?.emailAddress,
      },
    });
  }),

  getByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.teacherProfile.findFirst({
        where: {
          email: input.email,
        },
      });
    }),

  getWorksheets: protectedProcedure.query(async ({ ctx }) => {
    const fetchWorksheets = () => {
      return ctx.prisma.teacherProfile.findFirst({
        where: {
          email: ctx.user?.emailAddresses[0]?.emailAddress,
        },
        select: {
          id: true,
          worksheets: {
            orderBy: { lastEdited: "desc" },
            select: {
              id: true,
              title: true,
              lastEdited: true,
              publishedWorksheets: {
                select: {
                  id: true,
                  code: true,
                },
                orderBy: { createdTime: "desc" },
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
          email: ctx.user?.emailAddresses[0]?.emailAddress,
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
        email: ctx.user?.emailAddresses[0]?.emailAddress,
      },
      select: {
        publishedWorksheets: {
          orderBy: { createdTime: "desc" },
          select: {
            id: true,
            code: true,
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
          userId: ctx.userId,
          email: ctx.user?.emailAddresses[0]?.emailAddress,
        },
      });
    }),
});
