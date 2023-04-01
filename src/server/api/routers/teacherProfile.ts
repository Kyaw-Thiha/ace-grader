import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";

export const teacherProfileRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teacherProfile.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getWorksheets: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teacherProfile.findMany({
      where: {
        userId: ctx.session.user.id,
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
  }),

  getPublishedWorksheets: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teacherProfile.findMany({
      where: {
        userId: ctx.session.user.id,
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

  create: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.teacherProfile.create({
      data: {
        username: ctx.session.user.name ?? "",
        userId: ctx.session.user.id,
      },
    });
  }),
});
