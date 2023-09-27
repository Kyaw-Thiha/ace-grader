import { useEffect, useState } from "react";
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
import OpenEndedQuestion from "@/components/worksheet/OpenEndedQuestion";
import NestedQuestion from "@/components/worksheet/NestedQuestion";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  DeleteQuestionButton,
  PublishWorksheetButton,
} from "@/components/worksheet/QuestionDialogs";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ToggleTheme from "@/components/ToggleTheme";
import { ChangeOwnerDialog } from "@/components/worksheet/CollaboratorsDialog";
import ReorderButtons from "@/components/worksheet/ReorderButtons";
import EssayQuestion from "@/components/worksheet/EssayQuestion";

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
  const {
    data: worksheet,
    refetch: refetchWorksheet,
    isLoading,
  } = api.worksheet.get.useQuery({ id: worksheetId });
  useEffect(() => {
    setTitle(worksheet?.title ?? "");
  }, [worksheet]);

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
      <Head>
        <title>AceGrader</title>
        <meta
          property="og:title"
          content="AceGrader - Empowering Teachers & Students"
        />
        <meta
          property="og:description"
          content="AceGrader is an AI-powered innovative website software designed to streamline the daily tasks of teachers and enhance student learning."
        />
        <meta
          property="og:image"
          content="https://acegrader.com/images/logo-light.png"
        />
      </Head>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b bg-background">
          <nav className="container mx-auto flex justify-between px-4 py-4">
            <div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-row items-center gap-4">
              <ToggleTheme />
              <ChangeOwnerDialog
                worksheetId={worksheetId}
                refetch={refetchWorksheet}
              />
              <PublishWorksheetButton
                worksheetId={worksheetId}
                refetch={refetchWorksheet}
              />
            </div>
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
            worksheetId={worksheetId}
            order={1}
            worksheetContext={{
              country: worksheet?.country ?? "",
              curriculum: worksheet?.curriculum ?? "",
              subject: worksheet?.subject ?? "",
            }}
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
                  <ReorderButtons
                    questions={questions}
                    order={question.order}
                    refetch={refetchWorksheet}
                  />
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
                  {question.questionType == "MultipleChoiceQuestion" && (
                    <MultipleChoiceQuestion
                      question={question.multipleChoiceQuestion}
                      refetch={refetchWorksheet}
                    />
                  )}
                  {question.questionType == "ShortAnswerQuestion" && (
                    <ShortAnswerQuestion
                      question={question.shortAnswerQuestion}
                      refetch={refetchWorksheet}
                    />
                  )}
                  {question.questionType == "OpenEndedQuestion" && (
                    <OpenEndedQuestion
                      question={question.openEndedQuestion}
                      refetch={refetchWorksheet}
                    />
                  )}
                  {question.questionType == "EssayQuestion" && (
                    <EssayQuestion
                      question={question.essayQuestion}
                      refetch={refetchWorksheet}
                    />
                  )}
                  {question.questionType == "NestedQuestion" && (
                    <NestedQuestion
                      question={question.nestedQuestion}
                      refetch={refetchWorksheet}
                      worksheetContext={{
                        country: worksheet?.country ?? "",
                        curriculum: worksheet?.curriculum ?? "",
                        subject: worksheet?.subject ?? "",
                      }}
                      nestedLevel={2}
                    />
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
        <div className="flex justify-center">
          <AddQuestionButton
            worksheetId={worksheetId}
            order={(questions?.length ?? 0) + 1}
            worksheetContext={{
              country: worksheet?.country ?? "",
              curriculum: worksheet?.curriculum ?? "",
              subject: worksheet?.subject ?? "",
            }}
            refetch={refetchWorksheet}
          />
        </div>
      </div>
    );
  }
};
