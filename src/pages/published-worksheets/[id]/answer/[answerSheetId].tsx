import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "@utils/api";
import Link from "next/link";
import Image from "next/image";
import Toast from "@components/Toast";
import { toast } from "react-toastify";
import Loading from "@components/Loading";
import { type AnswerSheetStatus } from "@utils/interface";
import MultipleChoiceQuestion from "@components/answerSheet/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@components/answerSheet/ShortAnswerQuestion";
import LongAnswerQuestion from "@components/answerSheet/LongAnswerQuestion";
import Dialog from "@components/Dialog";

const SampleAnswerSheet: NextPage = () => {
  const router = useRouter();
  const { isReady } = router;
  const { id, answerSheetId } = router.query;

  const { data: sessionData } = useSession();
  const isLoggedIn = sessionData?.user !== undefined;

  return (
    <>
      <Head>
        <title>SmartGrader</title>
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
      <main>
        <div className="navbar">
          <Link href="/" className="btn-ghost btn text-2xl normal-case">
            <Image
              src="/images/logo-icon.png"
              alt="Logo"
              width="32"
              height="32"
            />
            <h2 className="ml-2">SmartGrader</h2>
          </Link>
        </div>
        {isReady ? (
          <>
            {isLoggedIn ? (
              <CheckIfUserCreatedWorksheet
                publishedWorksheetId={id as string}
                answerSheedId={answerSheetId as string}
              />
            ) : (
              <QuestionList
                publishedWorksheetId={id as string}
                answerSheedId={answerSheetId as string}
              />
            )}
          </>
        ) : (
          <></>
        )}
        <Toast />
      </main>
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
          {/* <AddQuestionButton
            id={publishedWorksheetId}
            order={1}
            refetch={refetchWorksheet}
          /> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="mt-4">
        {questions?.map((question, index) => (
          <div key={question.id} className="my-4 md:mx-8 md:rounded-md">
            <div className="bg-slate-50 shadow-sm">
              <div className="flex gap-4 py-12 px-2 md:gap-8 md:px-16 md:py-16">
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
            {/* <div className="flex justify-center">
              <AddQuestionButton
                id={worksheetId}
                order={(questions?.length ?? 0) + 1}
                refetch={refetchWorksheet}
              />
            </div> */}
          </div>
        ))}
        <div className="flex h-64 justify-center">
          {/* <AddQuestionButton
            id={worksheetId}
            order={(questions?.length ?? 0) + 1}
            refetch={refetchWorksheet}
          /> */}
        </div>
      </div>
    );
  }
};

const SubmitAnswerSheetButton: React.FC<Props> = (props) => {
  const dialogId = `submit-answer`;

  const editStatus = api.answerSheet.editStatus.useMutation({
    onSuccess: () => {
      // void props.refetch();
    },
  });

  const submitAnswer = () => {
    void editStatus.mutate({ id: props.answerSheedId, status: "checking" });
  };

  return (
    <>
      <Dialog
        id={dialogId}
        openContainer={
          <label htmlFor={dialogId} className="btn-primary btn text-lg">
            Submit
          </label>
        }
        body={
          <>
            <h3 className="mb-4 text-2xl font-bold">Submit Answer Sheet</h3>
            <h4 className="mb-2">
              Once submitted, your teacher can now check the answers
            </h4>
            <p className="mb-6">
              You will be informed once your teacher finishes checking
            </p>
          </>
        }
        actions={
          <>
            <label htmlFor={dialogId} className="btn-ghost btn">
              Cancel
            </label>
            <label htmlFor={dialogId} className="btn-success btn">
              Publish
            </label>
          </>
        }
      />
    </>
  );
};
