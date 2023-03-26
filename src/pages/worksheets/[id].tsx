import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { Autosave, useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@utils/api";
import Toast from "@components/Toast";
import AddQuestionButton from "@components/worksheet/AddQuestionButton";
import Loading from "@components/Loading";
import MultipleChoiceQuestion from "@components/worksheet/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@components/worksheet/ShortAnswerQuestion";
import LongAnswerQuestion from "@components/worksheet/LongAnswerQuestion";
import Dialog from "@components/Dialog";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const WorksheetEditor: NextPage = () => {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Worksheesh</title>
        <meta name="description" content="Worksheeet Editor" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main className="min-h-screen bg-slate-300">
        {isReady ? (
          <>
            <WorksheetHeader worksheetId={id as string} />
            <QuestionList worksheetId={id as string} />
          </>
        ) : (
          <></>
        )}

        <Toast />
      </main>
    </>
  );
};

export default WorksheetEditor;

// https://www.npmjs.com/package/react-autosave
interface WorksheetHeaderProps {
  worksheetId: string;
}

const WorksheetHeader: React.FC<WorksheetHeaderProps> = ({ worksheetId }) => {
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
      editTitle.mutate({ id: worksheetId, title: title });
    }
  };
  useAutosave({ data: title, onSave: updateTitle });

  return (
    <>
      <div className="navbar backdrop-blur-lg">
        <div className="mt-4 flex-1">
          <input
            type="text"
            placeholder="Type here"
            className="input-bordered input w-full max-w-xs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex-none">
          <button className="btn-primary btn">Publish</button>
        </div>
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
      <div className="mt-4" ref={parent}>
        {questions?.map((question) => (
          <div
            key={question.id}
            className="my-4 bg-slate-50 shadow-sm md:mx-8 md:rounded-md"
          >
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
            <div className="flex gap-4 py-12 px-2 md:gap-8 md:px-16 md:py-16">
              <p className="my-2 text-3xl text-slate-400">{question.order}.</p>
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
          </div>
        ))}
        <div className="flex h-64 justify-center">
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

type Questions = RouterOutputs["question"]["getAll"];

interface DeleteQuestionButtonProps {
  id: string;
  order: number;
  questions: Questions;
  refetch: QueryObserverBaseResult["refetch"];
}

const DeleteQuestionButton: React.FC<DeleteQuestionButtonProps> = (props) => {
  const dialogId = `delete-question-${props.order}`;

  //Function for deleting question
  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  //Function for editing question
  const editQuestion = api.question.editOrder.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const removeQuestion = () => {
    void toast
      .promise(
        deleteQuestion.mutateAsync({
          id: props.id,
        }),
        {
          pending: "Removing Question",
          success: "Question Removed 👌",
          error: "Error in Question Deletion 🤯",
        }
      )
      .then(() => {
        for (const question of props.questions) {
          if (question.order > props.order) {
            editQuestion.mutate({ id: question.id, order: question.order - 1 });
          }
        }
      });
  };

  return (
    <>
      <Dialog
        id={dialogId}
        openContainer={
          <label htmlFor={dialogId} className="btn-ghost btn text-lg">
            ✕
          </label>
        }
        body={
          <>
            <h3 className="mb-4 text-2xl font-bold">Delete Question</h3>
            <h4 className="mb-2">Note: This process is irreversible</h4>
            <p className="mb-6">
              Are you sure you want to delete this question?
            </p>
          </>
        }
        actions={
          <>
            <label htmlFor={dialogId} className="btn-ghost btn">
              Cancel
            </label>
            <label
              htmlFor={dialogId}
              className="btn-warning btn"
              onClick={removeQuestion}
            >
              Delete Worksheet
            </label>
          </>
        }
      />
    </>
  );
};
