import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { api } from "@/utils/api";
import Image from "next/image";
import Loading from "@/components/Loading";

import MultipleChoiceQuestion from "@/components/answerSheet/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/components/answerSheet/ShortAnswerQuestion";
import OpenEndedQuestion from "@/components/answerSheet/OpenEndedQuestion";
import { Card } from "@/components/ui/card";
import AnswerSheetNavLayout from "@/components/AnswerSheetNavLayout";

export function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.["id"];
  const worksheetId = id as string;

  return {
    props: {
      id: worksheetId,
    },
  };
}

const SampleAnswerSheet: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  return (
    <>
      <AnswerSheetNavLayout>
        <QuestionList publishedWorksheetId={id} />
      </AnswerSheetNavLayout>
    </>
  );
};

export default SampleAnswerSheet;

interface Props {
  publishedWorksheetId: string;
}

const QuestionList: React.FC<Props> = ({ publishedWorksheetId }) => {
  //Fetching the worksheet
  const {
    data: publishedWorksheet,
    refetch: refetchWorksheet,
    isLoading,
    isError,
  } = api.publishedWorksheet.getQuestions.useQuery({
    id: publishedWorksheetId,
  });
  const questions = publishedWorksheet?.questions;

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
      <div>
        <h2 className="mb-8 mt-0 text-center text-3xl font-medium md:mb-12 md:mt-4">
          {publishedWorksheet?.title}
        </h2>
        {questions?.map((question) => (
          <div
            key={question.id}
            className="my-4 md:mx-20 md:rounded-md lg:mx-32"
          >
            <Card>
              <div className="gap-4 px-2 py-4 md:gap-8 md:px-8 ">
                <p className="my-2 text-3xl text-slate-400">
                  {question.order}.
                </p>
                <div>
                  {question.questionType == "MultipleChoiceQuestion" ? (
                    <MultipleChoiceQuestion
                      question={question.multipleChoiceQuestion}
                      refetch={refetchWorksheet}
                      status="sample-teacherview"
                    />
                  ) : (
                    <></>
                  )}
                  {question.questionType == "ShortAnswerQuestion" ? (
                    <ShortAnswerQuestion
                      question={question.shortAnswerQuestion}
                      refetch={refetchWorksheet}
                      status="sample-teacherview"
                    />
                  ) : (
                    <></>
                  )}
                  {question.questionType == "LongAnswerQuestion" ? (
                    <OpenEndedQuestion
                      question={question.longAnswerQuestion}
                      refetch={refetchWorksheet}
                      status="sample-teacherview"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
        <div className="flex h-64 justify-center"></div>
      </div>
    );
  }
};
