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
import { useState } from "react";
import { Card } from "@/components/ui/card";
import AnswerSheetNavLayout from "@/components/AnswerSheetNavLayout";

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
                  console.log("Submited");
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
            <Card>
              <div className="flex gap-4 px-2 py-4 md:gap-8 md:px-8">
                <p className="my-2 text-3xl text-slate-400">
                  {question.order}.
                </p>
                <div className="w-full">
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

                  {question.questionType == "OpenEndedQuestion" && (
                    <OpenEndedQuestion
                      question={question.openEndedQuestion}
                      answer={answers.at(index)?.openEndedQuestionAnswer}
                      refetch={refetchWorksheet}
                      status={status}
                    />
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
        <div className="mt-8 flex h-64 justify-center md:mx-8">
          {status == "answering-studentview" ? (
            <SubmitAnswerDialog
              worksheetId={props.publishedWorksheetId}
              answerSheetId={props.answerSheedId}
              refetch={refetchAnswerSheet}
              onSubmit={() => setIsChecking(true)}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
};
