import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { api } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import { type AnswerSheetStatus } from "@/utils/interface";
import MultipleChoiceQuestion from "@/components/answerSheet/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/components/answerSheet/ShortAnswerQuestion";
import LongAnswerQuestion from "@/components/answerSheet/LongAnswerQuestion";
import { Button } from "@/components/ui/button";
import { SubmitAnswerDialog } from "@/components/answerSheet/SubmitAnswer";
import CheckingInProgress from "@/components/answerSheet/CheckingInProgress";
import { useState } from "react";

export function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.["id"] as string;

  const answerSheetId = context.params?.["answerSheetId"] as string;

  return {
    props: {
      id,
      answerSheetId,
    },
  };
}

const SampleAnswerSheet: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id, answerSheetId }) => {
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
            <Button asChild className="flex gap-2 px-4 py-6" variant="outline">
              <Link href="/">
                <Image
                  src="/images/logo-icon.png"
                  alt="Logo"
                  width="32"
                  height="32"
                />
                <span className="text-2xl font-bold">SmartGrader</span>
              </Link>
            </Button>
          </nav>
        </header>
        <main className="container mx-auto flex-grow px-4 py-8">
          <SignedIn>
            <CheckIfUserCreatedWorksheet
              publishedWorksheetId={id}
              answerSheedId={answerSheetId}
            />
          </SignedIn>
          <SignedOut>
            <QuestionList
              publishedWorksheetId={id}
              answerSheedId={answerSheetId}
            />
          </SignedOut>
        </main>
      </div>
    </>
  );
};

export default SampleAnswerSheet;

interface Props {
  publishedWorksheetId: string;
  answerSheedId: string;
}

const CheckIfUserCreatedWorksheet: React.FC<Props> = (props) => {
  //Fetching list of worksheets
  const {
    data: teacherProfiles,
    isLoading,
    isError,
  } = api.teacherProfile.getAll.useQuery();

  const { data: publishedWorksheet } = api.publishedWorksheet.get.useQuery(
    { id: props.publishedWorksheetId } // no input
  );

  const profileId = publishedWorksheet?.profileId ?? "";
  const profiles = teacherProfiles ?? [];

  let status = "";
  if (profileId in profiles) {
    status = `${status}-teacherview`;
  } else {
    status = `${status}-studentview`;
  }

  return (
    <QuestionList
      publishedWorksheetId={props.publishedWorksheetId}
      answerSheedId={props.answerSheedId}
      status={status as AnswerSheetStatus}
    />
  );
};

interface QuestionListProps {
  publishedWorksheetId: string;
  answerSheedId: string;
  status?: AnswerSheetStatus;
}

const QuestionList: React.FC<QuestionListProps> = (props) => {
  const [isChecking, setIsChecking] = useState(false);

  //Fetching the worksheet
  const {
    data: publishedWorksheet,
    refetch: refetchWorksheet,
    isLoading,
    isError,
  } = api.publishedWorksheet.getQuestions.useQuery({
    id: props.publishedWorksheetId,
  });
  const questions = publishedWorksheet?.questions;

  //Fetching the answer sheet
  const { data: answerSheet, refetch: refetchAnswerSheet } =
    api.answerSheet.getAnswers.useQuery({
      id: props.answerSheedId,
    });
  const answers = answerSheet?.answers ?? [];

  const status =
    props.status ?? `${answerSheet?.status ?? "answering"}-studentview`;

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
          There seems to have been some sort of error
        </div>
      </div>
    );
  } else if (isChecking || status == "checking-studentview") {
    return <CheckingInProgress />;
  } else {
    return (
      <div className="mt-4">
        {questions?.map((question, index) => (
          <div key={question.id} className="my-4 md:mx-8 md:rounded-md">
            <div className="bg-slate-50 shadow-sm">
              <div className="flex gap-4 px-2 py-12 md:gap-8 md:px-16 md:py-16">
                <p className="my-2 text-3xl text-slate-400">
                  {question.order}.
                </p>
                <div>
                  {question.questionType == "MultipleChoiceQuestion" ? (
                    <MultipleChoiceQuestion
                      question={question.multipleChoiceQuestion}
                      answer={answers.at(index)?.multipleChoiceQuestionAnswer}
                      refetch={refetchWorksheet}
                      status={status}
                    />
                  ) : (
                    <></>
                  )}
                  {question.questionType == "ShortAnswerQuestion" ? (
                    <ShortAnswerQuestion
                      question={question.shortAnswerQuestion}
                      answer={answers.at(index)?.shortAnswerQuestionAnswer}
                      refetch={refetchWorksheet}
                      status={status}
                    />
                  ) : (
                    <></>
                  )}
                  {question.questionType == "LongAnswerQuestion" ? (
                    <LongAnswerQuestion
                      question={question.longAnswerQuestion}
                      answer={answers.at(index)?.longAnswerQuestionAnswer}
                      refetch={refetchWorksheet}
                      status={status}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-8 flex h-64 justify-center md:mx-8">
          <SubmitAnswerDialog
            worksheetId={props.publishedWorksheetId}
            answerSheetId={props.answerSheedId}
            refetch={refetchAnswerSheet}
            onSubmit={() => setIsChecking(true)}
          />
        </div>
      </div>
    );
  }
};
