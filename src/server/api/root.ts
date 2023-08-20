import { createTRPCRouter } from "@/server/api/trpc";
import { teacherProfileRouter } from "./routers/teacherProfile";
import { publishedWorksheetRouter } from "./routers/publishedWorksheet";
import { teacherNotificationRouter } from "./routers/teacherNotification";
import { worksheetRouter } from "./routers/worksheet";
import { questionRouter } from "./routers/question";
import { multipleChoiceQuestionRouter } from "./routers/multipleChoiceQuestion";
import { shortAnswerQuestionRouter } from "./routers/shortAnswerQuestion";
import { openEndedQuestionRouter } from "./routers/openEnededQuestion";
import { answerSheetRouter } from "./routers/answerSheet";
import { multipleChoiceQuestionAnswerRouter } from "./routers/multipleChoiceQuestionAnswer";
import { shortAnswerQuestionAnswerRouter } from "./routers/shortAnswerQuestionAnswer";
import { openEndedQuestionAnswerRouter } from "./routers/openEndedQuestionAnswer";
import { userRouter } from "./routers/user";
import { imageRouter } from "./routers/image";
import { nestedQuestionRouter } from "./routers/nestedQuestion";
import { nestedQuestionAnswerRouter } from "./routers/nestedQuestionAnswer";
import { essayQuestionRouter } from "./routers/essayQuestion";
import { essayAnswerRouter } from "./routers/essayAnswer";

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
  nestedQuestion: nestedQuestionRouter,
  multipleChoiceQuestion: multipleChoiceQuestionRouter,
  shortAnswerQuestion: shortAnswerQuestionRouter,
  openEndedQuestion: openEndedQuestionRouter,
  essayQuestion: essayQuestionRouter,
  answerSheet: answerSheetRouter,
  nestedQuestionAnswer: nestedQuestionAnswerRouter,
  multipleChoiceQuestionAnswer: multipleChoiceQuestionAnswerRouter,
  shortAnswerQuestionAnswer: shortAnswerQuestionAnswerRouter,
  openEndedQuestionAnswer: openEndedQuestionAnswerRouter,
  essayAnswer: essayAnswerRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
