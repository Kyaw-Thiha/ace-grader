// import type { QueryObserverBaseResult } from "@tanstack/react-query";
// import { api, type RouterOutputs } from "@/utils/api";
// import { Sigma } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { useRef } from "react";

// type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
// type OpenEndedQuestion = RouterOutputs["openEndedQuestion"]["get"];

// interface Props {
//   worksheetId: string;
//   question: MultipleChoiceQuestion | OpenEndedQuestion;
//   questionType: "MultipleChoiceQuestion" | "OpenEndedQuestion";
// }

// const MathSymbolButton: React.FC<Props> = (props) => {
//   const utils = api.useContext();

//   //Function for editing multiple choice question
//   const editMultipleChoiceQuestion =
//     api.multipleChoiceQuestion.editMathSymbol.useMutation({
//       async onMutate(payload) {
//         // Cancel outgoing fetches (so they don't overwrite our optimistic update)
//         await utils.worksheet.getQuestions.cancel();
//         // Get the data from the queryCache
//         const prevData = utils.worksheet.getQuestions.getData();
//         // Optimistically update the data with our new post
//         utils.question.getAll.setData({}, (oldQuestions) => oldQuestions);
//         utils.worksheet.getQuestions.setData(
//           { id: props.worksheetId },
//           (oldWorksheet) => {
//             // Deep-Copy
//             const newWorksheet = structuredClone(oldWorksheet);
//             const question = newWorksheet?.questions.find(
//               (question) => question.multipleChoiceQuestion?.id == payload.id
//             );

//             // @ts-expect-error: Let's ignore a compile error like this unreachable code
//             newWorksheet.questions[
//               (question?.order ?? 0) - 1
//             ].multipleChoiceQuestion = {
//               ...newWorksheet?.questions[(question?.order ?? 0) - 1]
//                 ?.multipleChoiceQuestion,
//               mathSymbol: payload.mathSymbol ?? false,
//             };

//             return newWorksheet;
//           }
//         );
//         // Return the previous data so we can revert if something goes wrong
//         return { prevData };
//       },
//       onError(err, newPost, ctx) {
//         // If the mutation fails, use the context-value from onMutate
//         utils.worksheet.getQuestions.setData(
//           { id: props.worksheetId },
//           ctx?.prevData
//         );
//       },
//       async onSettled() {
//         // Sync with server once mutation has settled
//         await utils.worksheet.getQuestions.invalidate();
//       },
//     });

//   const editOpenEndedQuestion =
//     api.openEndedQuestion.editMathSymbol.useMutation({
//       async onMutate(payload) {
//         // Cancel outgoing fetches (so they don't overwrite our optimistic update)
//         await utils.worksheet.getQuestions.cancel();
//         // Get the data from the queryCache
//         const prevData = utils.worksheet.getQuestions.getData();
//         // Optimistically update the data with our new post
//         utils.question.getAll.setData({}, (oldQuestions) => oldQuestions);
//         utils.worksheet.getQuestions.setData(
//           { id: props.worksheetId },
//           (oldWorksheet) => {
//             // Deep-Copy
//             const newWorksheet = structuredClone(oldWorksheet);
//             const question = newWorksheet?.questions.find(
//               (question) => question.openEndedQuestion?.id == payload.id
//             );

//             // @ts-expect-error: Let's ignore a compile error like this unreachable code
//             newWorksheet.questions[
//               (question?.order ?? 0) - 1
//             ].openEndedQuestion = {
//               ...newWorksheet?.questions[(question?.order ?? 0) - 1]
//                 ?.openEndedQuestion,
//               mathSymbol: payload.mathSymbol ?? false,
//             };

//             return newWorksheet;
//           }
//         );
//         // Return the previous data so we can revert if something goes wrong
//         return { prevData };
//       },
//       onError(err, newPost, ctx) {
//         // If the mutation fails, use the context-value from onMutate
//         utils.worksheet.getQuestions.setData(
//           { id: props.worksheetId },
//           ctx?.prevData
//         );
//       },
//       async onSettled() {
//         // Sync with server once mutation has settled
//         await utils.worksheet.getQuestions.invalidate();
//       },
//     });

//   const toggleMathSymbol = () => {
//     if (props.questionType == "MultipleChoiceQuestion") {
//       editMultipleChoiceQuestion.mutate({
//         id: props.question?.id ?? "",
//         mathSymbol: !props.question?.mathSymbol,
//         // text: props.question?.text ?? "",
//       });
//     } else if (props.questionType == "OpenEndedQuestion") {
//       editOpenEndedQuestion.mutate({
//         id: props.question?.id ?? "",
//         mathSymbol: !props.question?.mathSymbol,
//         // text: props.question?.text ?? "",
//       });
//     }
//   };

//   return (
//     <>
//       {props.question?.mathSymbol && (
//         <Button className="px-2" onClick={toggleMathSymbol}>
//           <Sigma className="h-4 w-4" />
//         </Button>
//       )}

//       {!props.question?.mathSymbol && (
//         <>
//           <Button variant="ghost" className="px-2" onClick={toggleMathSymbol}>
//             <Sigma className="h-4 w-4" />
//           </Button>
//         </>
//       )}
//     </>
//   );
// };

// export default MathSymbolButton;
