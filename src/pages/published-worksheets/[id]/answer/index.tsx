import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/Loading";
import MultipleChoiceQuestion from "@/components/answerSheet/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/components/answerSheet/ShortAnswerQuestion";
import LongAnswerQuestion from "@/components/answerSheet/LongAnswerQuestion";
import { Button } from "@/components/ui/button";

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
          <QuestionList publishedWorksheetId={id} />
        </main>
      </div>
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
      <div className="mt-4">
        {questions?.map((question) => (
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
                    <LongAnswerQuestion
                      question={question.longAnswerQuestion}
                      refetch={refetchWorksheet}
                      status="sample-teacherview"
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
