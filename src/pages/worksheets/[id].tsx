import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { Autosave, useAutosave } from "react-autosave";
import { api } from "@utils/api";
import Toast from "@components/Toast";
import AddQuestionButton from "@components/worksheet/AddQuestionButton";
import Loading from "@components/Loading";

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
    return;
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
            order={0}
            refetch={refetchWorksheet}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="mt-4">
        {questions?.map((question) => (
          <div
            key={question.id}
            className="my-4 bg-slate-50 py-4 px-2 md:mx-8 md:rounded-md md:px-4 md:py-8"
          >
            Hi
          </div>
        ))}
      </div>
    );
  }
};
