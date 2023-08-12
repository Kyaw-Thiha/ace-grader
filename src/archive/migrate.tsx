// import { Button } from "@/components/ui/button";
// import { api } from "@/utils/api";
// import type { NextPage } from "next";

// const MigratePage: NextPage = () => {
//   const { data: longAnswerQuestions, isLoading: questionLoading } =
//     api.question.getAllLongAnswerQuestions.useQuery();

//   const { data: longAnswerQuestionAnswers, isLoading: answerLoading } =
//     api.answerSheet.getAllLongAnswerQuestionAnswers.useQuery();

//   const createQuestion = api.openEndedQuestion.create.useMutation({});
//   const deleteQuestion = api.question.delete.useMutation({});
//   const createAnswer = api.openEndedQuestionAnswer.create.useMutation({});
//   const deleteAnswer = api.openEndedQuestionAnswer.deleteAnswer.useMutation({});

//   const migrateLongAnswerQuestions = async () => {
//     const questions = longAnswerQuestions ?? [];

//     for (const question of questions) {
//       console.log(question);
//       await createQuestion.mutateAsync({
//         order: question.order,
//         worksheetId: question.worksheetId ?? "",
//         publishedWorksheetId: question.publishedWorksheetId ?? "",
//         parentId: question.parentId ?? "",
//         text: question.longAnswerQuestion?.text ?? "",
//         explanation: question.longAnswerQuestion?.explanation ?? "",
//         marks: question.longAnswerQuestion?.marks,
//         markingScheme: question.longAnswerQuestion?.markingScheme as string[],
//       });
//       await deleteQuestion.mutateAsync({ id: question.id });
//     }
//   };

//   const migrateLongAnswerQuestionAnswers = async () => {
//     const answers = longAnswerQuestionAnswers ?? [];
//     for (const answer of answers) {
//       await createAnswer.mutateAsync({
//         order: answer.order,
//         answerSheetId: answer.answerSheetId,
//         studentAnswer: answer.longAnswerQuestionAnswer?.studentAnswer ?? "",
//         feedback: answer.longAnswerQuestionAnswer?.feedback,
//       });

//       await deleteAnswer.mutateAsync({ id: answer.id });
//     }
//   };

//   return (
//     <div className="flex h-full flex-col items-center justify-center gap-4">
//       <Button
//         disabled={questionLoading}
//         onClick={() => void migrateLongAnswerQuestions()}
//       >
//         Migrate Long Answer Questions
//       </Button>
//       <Button
//         disabled={answerLoading}
//         onClick={() => void migrateLongAnswerQuestionAnswers()}
//       >
//         Migrate Long Answer Question Answers
//       </Button>
//     </div>
//   );
// };

// export default MigratePage;
