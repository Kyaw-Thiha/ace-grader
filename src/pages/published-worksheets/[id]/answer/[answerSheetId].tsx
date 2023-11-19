import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { api } from "@/utils/api";
import Image from "next/image";
import Loading from "@/components/Loading";
import { type AnswerSheetStatus } from "@/utils/interface";
import MultipleChoiceQuestion from "@/components/answerSheet/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/components/answerSheet/ShortAnswerQuestion";
import OpenEndedQuestion from "@/components/answerSheet/OpenEndedQuestion";
import {
  CheckAnswerButton,
  SubmitAnswerDialog,
} from "@/components/answerSheet/SubmitAnswer";
import CheckingInProgress from "@/components/answerSheet/CheckingInProgress";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import AnswerSheetNavLayout from "@/components/AnswerSheetNavLayout";
import NestedQuestion from "@/components/answerSheet/NestedQuestion";
import EssayQuestion from "@/components/answerSheet/EssayQuestion";

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
      <AnswerSheetNavLayout>
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
      </AnswerSheetNavLayout>
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
    data: teacherProfile,
    isLoading,
    isError,
  } = api.teacherProfile.getCurrentUser.useQuery();

  const { data: publishedWorksheet } = api.publishedWorksheet.get.useQuery(
    { id: props.publishedWorksheetId } // no input
  );

  const profileId = publishedWorksheet?.profileId ?? "";

  return (
    <QuestionList
      publishedWorksheetId={props.publishedWorksheetId}
      answerSheedId={props.answerSheedId}
      isTeacher={profileId == teacherProfile?.id}
    />
  );
};

interface QuestionListProps {
  publishedWorksheetId: string;
  answerSheedId: string;
  isTeacher?: boolean;
}

const QuestionList: React.FC<QuestionListProps> = (props) => {
  // ***
  //Function for incrementing window change count
  const incrementWindowCount =
    api.answerSheet.incrementSwitchWindowCount.useMutation({
      onSuccess: () => {
        void refetchAnswerSheet();
      },
    });

  // Function for creating notification
  const createNotification = api.teacherNotification.create.useMutation();

  const [hasRun, setHasRun] = useState(false);
  // Checking when student changes the window
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Check if document is defined before accessing it
      if (
        !hasRun &&
        status == "answering-studentview" &&
        !isChecking &&
        document.visibilityState === "hidden"
      ) {
        // setSwitchCount((prevCount) => prevCount + 1);
        incrementWindowCount.mutate({ id: props.answerSheedId });
        createNotification.mutate({
          profileId: publishedWorksheet?.profileId ?? "",
          text: `${answerSheet?.studentName ?? ""} (${
            answerSheet?.studentEmail ?? ""
          }) changed window when answering the ${
            publishedWorksheet?.title ?? ""
          }`,
          resource: "",
        });

        setHasRun(true);

        console.log("Incrementing Window Count");
      } else if (hasRun && document.visibilityState === "visible") {
        setHasRun(false);
      }
    };

    // Attach the event listener if document is defined and we're on the client side
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Clean up the event listener when the component is unmounted
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [incrementWindowCount, props.answerSheedId]); // Empty dependency array to ensure the effect runs only once
  // ***

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

  const status = props.isTeacher
    ? (`${answerSheet?.status ?? "answering"}-teacherview` as AnswerSheetStatus)
    : (`${
        answerSheet?.status ?? "answering"
      }-studentview` as AnswerSheetStatus);

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
      <div>
        <section className="md:mx-8">
          <h2 className="mb-8 mt-0 text-center text-3xl font-medium md:mb-12 md:mt-4">
            {publishedWorksheet?.title}
          </h2>

          {status.startsWith("returned-") ? (
            <p className="text-right">
              Total Marks: {answerSheet?.totalMarks}/
              {publishedWorksheet?.totalMarks}
            </p>
          ) : (
            <p className="text-right">
              Total Marks: {publishedWorksheet?.totalMarks}
            </p>
          )}

          {/* If answer sheet isn't checked, allows teacher to manually activate check */}
          {status.startsWith("checking-") && (
            <div className="my-4 text-right">
              <CheckAnswerButton
                worksheetId={props.publishedWorksheetId}
                answerSheetId={props.answerSheedId}
                refetch={refetchAnswerSheet}
                onSubmit={() => {
                  return;
                }}
              />
            </div>
          )}
        </section>

        {questions?.map((question, index) => (
          <div
            key={question.id}
            className="my-4 md:mx-20 md:rounded-md lg:mx-32"
          >
            <p className="mb-8">
              This is an exam. Thus, <b>DO NOT SWITCH YOUR WINDOW</b> until you
              have submited your exam paper. It will be recorded and reported to
              your teacher.
            </p>
            <Card>
              <div className="flex gap-4 px-2 py-4 md:gap-8 md:px-8">
                <p className="my-2 text-3xl text-slate-400">
                  {question.order}.
                </p>
                <div className="w-full">
                  {question.questionType == "MultipleChoiceQuestion" && (
                    <MultipleChoiceQuestion
                      question={question.multipleChoiceQuestion}
                      answer={answers.at(index)?.multipleChoiceQuestionAnswer}
                      refetch={refetchAnswerSheet}
                      status={status}
                    />
                  )}

                  {question.questionType == "OpenEndedQuestion" && (
                    <OpenEndedQuestion
                      question={question.openEndedQuestion}
                      answer={answers.at(index)?.openEndedQuestionAnswer}
                      refetch={refetchAnswerSheet}
                      status={status}
                    />
                  )}

                  {question.questionType == "EssayQuestion" && (
                    <EssayQuestion
                      question={question.essayQuestion}
                      answer={answers.at(index)?.essayAnswer}
                      refetch={refetchAnswerSheet}
                      status={status}
                    />
                  )}

                  {question.questionType == "NestedQuestion" && (
                    <NestedQuestion
                      question={question.nestedQuestion}
                      answer={answers.at(index)?.nestedQuestionAnswer}
                      refetch={refetchAnswerSheet}
                      nestedLevel={2}
                      status={status}
                    />
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
        <div className="mt-8 flex h-64 justify-center md:mx-8">
          {status == "answering-studentview" && (
            <SubmitAnswerDialog
              worksheetId={props.publishedWorksheetId}
              answerSheetId={props.answerSheedId}
              refetch={refetchAnswerSheet}
              onSubmit={() => setIsChecking(true)}
            />
          )}
        </div>
      </div>
    );
  }
};
