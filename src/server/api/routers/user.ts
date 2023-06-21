import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: ctx.userId,
      },
    });
  }),

  delete: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        id: ctx.userId,
      },
    });
  }),
});
