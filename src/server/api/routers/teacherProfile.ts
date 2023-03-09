import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";

export const teacherProfileRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teacherProfile.findMany({
      where: {
        userId: ctx.session.user.id,
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
