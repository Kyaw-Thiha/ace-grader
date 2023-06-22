import { createTRPCRouter } from "@/server/api/trpc";
import { teacherProfileRouter } from "./routers/teacherProfile";
import { publishedWorksheetRouter } from "./routers/publishedWorksheet";
import { teacherNotificationRouter } from "./routers/teacherNotification";
import { worksheetRouter } from "./routers/worksheet";
import { questionRouter } from "./routers/question";
import { multipleChoiceQuestionRouter } from "./routers/multipleChoiceQuestion";
import { shortAnswerQuestionRouter } from "./routers/shortAnswerQuestion";
import { longAnswerQuestionRouter } from "./routers/longAnswerQuestion";
import { answerSheetRouter } from "./routers/answerSheet";
import { multipleChoiceQuestionAnswerRouter } from "./routers/multipleChoiceQuestionAnswer";
import { shortAnswerQuestionAnswerRouter } from "./routers/shortAnswerQuestionAnswer";
import { longAnswerQuestionAnswerRouter } from "./routers/longAnswerQuestionAnswer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  teacherProfile: teacherProfileRouter,
  teacherNotification: teacherNotificationRouter,
  worksheet: worksheetRouter,
  publishedWorksheet: publishedWorksheetRouter,
  question: questionRouter,
  multipleChoiceQuestion: multipleChoiceQuestionRouter,
  shortAnswerQuestion: shortAnswerQuestionRouter,
  longAnswerQuestion: longAnswerQuestionRouter,
  answerSheet: answerSheetRouter,
  multipleChoiceQuestionAnswer: multipleChoiceQuestionAnswerRouter,
  shortAnswerQuestionAnswer: shortAnswerQuestionAnswerRouter,
  longAnswerQuestionAnswer: longAnswerQuestionAnswerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
