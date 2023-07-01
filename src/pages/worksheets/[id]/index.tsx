import { useState } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Autosave, useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import AddQuestionButton from "@/components/worksheet/AddQuestionButton";
import Loading from "@/components/Loading";
import MultipleChoiceQuestion from "@/components/worksheet/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/components/worksheet/ShortAnswerQuestion";
import LongAnswerQuestion from "@/components/worksheet/LongAnswerQuestion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  DeleteQuestionButton,
  PublishWorksheetButton,
} from "@/components/worksheet/QuestionDialogs";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.["id"];
  const worksheetId = id as string;

  return {
    props: {
      id: worksheetId,
    },
  };
}

const WorksheetEditor: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  return (
    <WorksheetLayout worksheetId={id}>
      <QuestionList worksheetId={id} />
    </WorksheetLayout>
  );
};

export default WorksheetEditor;

// https://www.npmjs.com/package/react-autosave
interface WorksheetHeaderProps {
  worksheetId: string;
  children: React.ReactNode;
}

const WorksheetLayout: React.FC<WorksheetHeaderProps> = ({
  worksheetId,
  children,
}) => {
  const [title, setTitle] = useState("");

  //Fetching the worksheet
  const { data: worksheet, refetch: refetchWorksheet } =
    api.worksheet.get.useQuery(
      { id: worksheetId },
      {
        onSuccess: (worksheet) => {
          setTitle(worksheet?.title ?? "");
        },
      }
    );

  // Automatically Editing the title
  const editTitle = api.worksheet.editTitle.useMutation({
    onSuccess: () => {
      void refetchWorksheet();
    },
  });
  const updateTitle = () => {
    if (title != "") {
      console.log("hello");
      editTitle.mutate({ id: worksheetId, title: title });
    }
  };
  useAutosave({ data: title, onSave: updateTitle });

  return (
    <>
      <Head>
        <title>Smart Grader</title>
        <meta
          name="description"
          content="A website where teachers can automate their workflow"
        />
      </Head>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <nav className="container mx-auto flex justify-between px-4 py-4">
            <div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>

            <PublishWorksheetButton
              worksheetId={worksheetId}
              refetch={refetchWorksheet}
            />
          </nav>
        </header>
        <main className="container mx-auto flex-grow px-4 py-8">
          {children}
        </main>
      </div>
    </>
  );
};

interface QuestionListProps {
  worksheetId: string;
}

const QuestionList: React.FC<QuestionListProps> = ({ worksheetId }) => {
  //Fetching the worksheet
  const {
    data: worksheet,
    refetch: refetchWorksheet,
    isLoading,
    isError,
  } = api.worksheet.getQuestions.useQuery({ id: worksheetId });
  const questions = worksheet?.questions;

  // Automatically animate the list add and delete
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  if (isLoading) {
    return <Loading />;
  } else if (questions?.length == 0) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-16">
        <Image
          src="/images/illustrations/empty_questions.svg"
          alt="Empty Worksheet Image"
          width="350"
          height="350"
          priority
        />
        <div className="flex items-center justify-center">
          <AddQuestionButton
            id={worksheetId}
            order={1}
            refetch={refetchWorksheet}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="mb-40 mt-4" ref={parent}>
        {questions?.map((question) => (
          <div key={question.id} className="my-4 md:mx-8 md:rounded-md">
            <Card>
              <div className="relative">
                <label className="absolute right-1 top-1 md:right-2 md:top-2">
                  <DeleteQuestionButton
                    id={question.id}
                    order={question.order}
                    refetch={refetchWorksheet}
                    questions={questions}
                  />
                </label>
              </div>
              <div className="px-2 py-4 md:px-16 md:pb-8 md:pt-4">
                <p className="my-2 text-3xl text-slate-400">
                  {question.order}.
                </p>
                <div>
                  {question.questionType == "MultipleChoiceQuestion" ? (
                    <MultipleChoiceQuestion
                      question={question.multipleChoiceQuestion}
                      refetch={refetchWorksheet}
                    />
                  ) : (
                    <></>
                  )}
                  {question.questionType == "ShortAnswerQuestion" ? (
                    <ShortAnswerQuestion
                      question={question.shortAnswerQuestion}
                      refetch={refetchWorksheet}
                    />
                  ) : (
                    <></>
                  )}
                  {question.questionType == "LongAnswerQuestion" ? (
                    <LongAnswerQuestion
                      question={question.longAnswerQuestion}
                      refetch={refetchWorksheet}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Card>
            {/* <div className="flex justify-center">
              <AddQuestionButton
                id={worksheetId}
                order={(questions?.length ?? 0) + 1}
                refetch={refetchWorksheet}
              />
            </div> */}
          </div>
        ))}
        <div className="flex justify-center">
          <AddQuestionButton
            id={worksheetId}
            order={(questions?.length ?? 0) + 1}
            refetch={refetchWorksheet}
          />
        </div>
      </div>
    );
  }
};

// type Questions = RouterOutputs["question"]["getAll"];

// interface DeleteQuestionButtonProps {
//   id: string;
//   order: number;
//   questions: Questions;
//   refetch: QueryObserverBaseResult["refetch"];
// }

// const DeleteQuestionButton: React.FC<DeleteQuestionButtonProps> = (props) => {
//   //Function for deleting question
//   const deleteQuestion = api.question.delete.useMutation({
//     onSuccess: () => {
//       void props.refetch();
//     },
//   });

//   //Function for editing question
//   const editQuestion = api.question.editOrder.useMutation({
//     onSuccess: () => {
//       void props.refetch();
//     },
//   });

//   const removeQuestion = () => {
//     void toast
//       .promise(
//         deleteQuestion.mutateAsync({
//           id: props.id,
//         }),
//         {
//           pending: "Removing Question",
//           success: "Question Removed 👌",
//           error: "Error in Question Deletion 🤯",
//         }
//       )
//       .then(() => {
//         for (const question of props.questions) {
//           if (question.order > props.order) {
//             editQuestion.mutate({ id: question.id, order: question.order - 1 });
//           }
//         }
//       });
//   };

//   return (
//     <>
//       {/* <Dialog
//         id={dialogId}
//         openContainer={
//           <label htmlFor={dialogId} className="btn-ghost btn text-lg">
//             ✕
//           </label>
//         }
//         body={
//           <>
//             <h3 className="mb-4 text-2xl font-bold">Delete Question</h3>
//             <h4 className="mb-2">Note: This process is irreversible</h4>
//             <p className="mb-6">
//               Are you sure you want to delete this question?
//             </p>
//           </>
//         }
//         actions={
//           <>
//             <label htmlFor={dialogId} className="btn-ghost btn">
//               Cancel
//             </label>
//             <label
//               htmlFor={dialogId}
//               className="btn-warning btn"
//               onClick={removeQuestion}
//             >
//               Delete Worksheet
//             </label>
//           </>
//         }
//       /> */}
//     </>
//   );
// };

// interface PublishQuestionButtonProps {
//   worksheetId: string;
//   refetch: QueryObserverBaseResult["refetch"];
// }

// const PublishWorksheetButton: React.FC<PublishQuestionButtonProps> = (
//   props
// ) => {
//   const dialogId = `publish-question`;

//   //Fetching the worksheet
//   const { data: worksheet, refetch: refetchWorksheet } =
//     api.worksheet.get.useQuery({ id: props.worksheetId });

//   //Fetching the questions
//   const { data: worksheetWithQuestions, refetch: refetchQuestions } =
//     api.worksheet.getQuestions.useQuery({ id: props.worksheetId });
//   const questions = worksheetWithQuestions?.questions ?? [];

//   //  Determining the version
//   const { data: publishedWorksheetCount } =
//     api.publishedWorksheet.getCount.useQuery({ profileId: props.worksheetId });
//   const count = publishedWorksheetCount ?? 0;
//   const version = count + 1;

//   //Creating the published worksheet
//   const createWorksheet = api.publishedWorksheet.create.useMutation({
//     onSuccess: () => {
//       void props.refetch();
//     },
//   });

//   const calculateTotalMarks = () => {
//     let totalMarks = 0;
//     for (const question of questions) {
//       if (question.questionType == "MultipleChoiceQuestion") {
//         const marks = question.multipleChoiceQuestion?.marks ?? 0;
//         totalMarks = totalMarks + marks;
//       }
//       // else if (question.questionType == "ShortAnswerQuestion") {
//       //   const marks = question.shortAnswerQuestion?.marks ?? 0;
//       //   totalMarks = totalMarks + marks;
//       // }
//       if (question.questionType == "LongAnswerQuestion") {
//         const marks = question.longAnswerQuestion?.marks ?? 0;
//         totalMarks = totalMarks + marks;
//       }
//     }

//     return totalMarks;
//   };

//   const createQuestionsPayload = () => {
//     const questionsPayload = [];

//     for (const question of questions) {
//       const choices = [];
//       const originalChoices = question.multipleChoiceQuestion?.choices ?? [];
//       for (const choice of originalChoices) {
//         choices.push({ index: choice.index ?? 1, text: choice.text ?? "" });
//       }

//       if (question.questionType == "MultipleChoiceQuestion") {
//         questionsPayload.push({
//           order: question.order,
//           questionType: question.questionType,
//           multipleChoiceQuestion: {
//             create: {
//               text: question.multipleChoiceQuestion?.text ?? "",
//               explanation: question.multipleChoiceQuestion?.explanation ?? "",
//               marks: question.multipleChoiceQuestion?.marks ?? 1,
//               answer: question.multipleChoiceQuestion?.answer ?? 0,
//               choices: {
//                 create: choices,
//               },
//             },
//           },
//         });
//       }
//       // else if (question.questionType == "ShortAnswerQuestion") {
//       //   questionsPayload.push({
//       //     order: question.order,
//       //     questionType: question.questionType,
//       //     shortAnswerQuestion: {
//       //       create: {
//       //         text: question.shortAnswerQuestion?.text ?? "",
//       //         marks: question.shortAnswerQuestion?.marks ?? 1,
//       //         answer: question.shortAnswerQuestion?.answer ?? "",
//       //       },
//       //     },
//       //   });
//       // }
//       else if (question.questionType == "LongAnswerQuestion") {
//         questionsPayload.push({
//           order: question.order,
//           questionType: question.questionType,
//           longAnswerQuestion: {
//             create: {
//               text: question.longAnswerQuestion?.text ?? "",
//               marks: question.longAnswerQuestion?.marks ?? 1,
//               markingScheme: question.longAnswerQuestion
//                 ?.markingScheme as string[],
//               sampleAnswer: question.longAnswerQuestion?.sampleAnswer ?? "",
//             },
//           },
//         });
//       }
//     }

//     return questionsPayload;
//   };

//   //Publishing the worksheet
//   const publishWorksheet = () => {
//     void toast.promise(
//       createWorksheet.mutateAsync({
//         title: worksheet?.title ?? "",
//         totalMarks: calculateTotalMarks(),
//         version: version,
//         profileId: worksheet?.profileId ?? "",
//         worksheetId: worksheet?.id ?? "",
//         questions: createQuestionsPayload(),
//       }),
//       {
//         pending: "Publishing Worksheet",
//         success: "Worksheet Published 👌",
//         error: "Error in Worksheet Publishing 🤯",
//       }
//     );
//   };

//   return (
//     <>
//       {/* <Dialog
//         id={dialogId}
//         openContainer={
//           <label htmlFor={dialogId} className="btn-primary btn text-lg">
//             Publish
//           </label>
//         }
//         body={
//           <>
//             <h3 className="mb-4 text-2xl font-bold">Publish Worksheet</h3>
//             <h4 className="mb-2">
//               Note: Future students answering will use the latest version of
//               worksheet
//             </h4>
//             <p className="mb-6">
//               Are you sure you want to publish this worksheet version?
//             </p>
//           </>
//         }
//         actions={
//           <>
//             <label htmlFor={dialogId} className="btn-ghost btn">
//               Cancel
//             </label>
//             <label
//               htmlFor={dialogId}
//               className="btn-success btn"
//               onClick={publishWorksheet}
//             >
//               Publish
//             </label>
//           </>
//         }
//       /> */}
//     </>
//   );
// };
