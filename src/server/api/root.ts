import { createTRPCRouter } from "@server/api/trpc";
import { exampleRouter } from "@server/api/routers/example";
import { teacherProfileRouter } from "./routers/teacherProfile";
import { userRouter } from "./routers/user";
import { publishedWorksheetRouter } from "./routers/publishedWorksheet";
import { teacherNotificationRouter } from "./routers/teacherNotification";
import { worksheetRouter } from "./routers/worksheet";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  teacherProfile: teacherProfileRouter,
  teacherNotification: teacherNotificationRouter,
  worksheet: worksheetRouter,
  publishedWorksheet: publishedWorksheetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
