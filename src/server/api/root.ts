import { createTRPCRouter } from "@server/api/trpc";
import { teacherProfileRouter } from "./routers/teacherProfile";
import { userRouter } from "./routers/user";
import { publishedWorksheetRouter } from "./routers/publishedWorksheet";
import { teacherNotificationRouter } from "./routers/teacherNotification";
import { worksheetRouter } from "./routers/worksheet";
import { questionRouter } from "./routers/question";
import { multipleChoiceQuestionRouter } from "./routers/multipleChoiceQuestion";
import { shortAnswerQuestionRouter } from "./routers/shortAnswerQuestion";
import { longAnswerQuestionRouter } from "./routers/longAnswerQuestion";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  teacherProfile: teacherProfileRouter,
  teacherNotification: teacherNotificationRouter,
  worksheet: worksheetRouter,
  publishedWorksheet: publishedWorksheetRouter,
  question: questionRouter,
  multipleChoiceQuestionRouter: multipleChoiceQuestionRouter,
  shortAnswerQuestionRouter: shortAnswerQuestionRouter,
  longAnswerQuestionRouter: longAnswerQuestionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
