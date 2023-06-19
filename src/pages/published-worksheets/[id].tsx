import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "@utils/api";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Toast from "@components/Toast";
import { toast } from "react-toastify";

const Answer: NextPage = () => {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

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
              <RedirectIfUserCreatedWorksheet id={id as string} />
            ) : (
              <StudentCredentialsForm id={id as string} />
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

export default Answer;

interface Props {
  id: string;
}

const RedirectIfUserCreatedWorksheet: React.FC<Props> = (props) => {
  const router = useRouter();

  //Fetching list of worksheets
  const {
    data: profiles,
    isLoading,
    isError,
  } = api.teacherProfile.getPublishedWorksheets.useQuery(
    undefined // no input
  );
  const publishedWorksheets = profiles?.at(0)?.publishedWorksheets ?? [];

  if (publishedWorksheets.some((e) => e.id == props.id)) {
    // If the user is the teacher who created the worksheet, redirect to the sample answer paper
    void router.replace(`${props.id}/answer`);
    return <></>;
  } else {
    return <StudentCredentialsForm id={props.id} />;
  }
};

const StudentCredentialsForm: React.FC<Props> = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  //Fetching list of worksheets
  const {
    data: publishedWorksheet,
    isLoading,
    isError,
  } = api.publishedWorksheet.get.useQuery({ id: props.id });

  //Function for creating answer sheet
  const createAnswerSheet = api.answerSheet.create.useMutation({
    onSuccess: (answerSheet) => {
      void router.push(`${props.id}/answer/${answerSheet.id}`);
    },
  });

  const addAnswerSheet = () => {
    if (name.trim() == "") {
      // If title is not entered
      toast.error("Enter your name");
    } else if (name.length > 250) {
      // If title is above word limit
      toast.error("Your name cannot have more than 500 characters");
    } else if (email.length > 250) {
      // If title is above character limit
      toast.error("Your email cannot have more than 250 characters");
    } else if (!email.includes("@")) {
      // If title is above character limit
      toast.error("Your email is in invalid format");
    } else {
      void toast.promise(
        createAnswerSheet.mutateAsync({
          studentName: name,
          studentEmail: email,
          publishedWorksheetId: props.id,
          answers: getAnswers(),
        }),
        {
          pending: "Creating Answer Sheet",
          success: "Answer Sheet Created 👌",
          error: "Error in Answer Sheet Creation 🤯",
        }
      );
    }
  };

  const getAnswers = () => {
    const answers = [];
    const questions = publishedWorksheet?.questions ?? [];

    type AnswerType =
      | "MultipleChoiceQuestionAnswer"
      | "ShortAnswerQuestionAnswer"
      | "LongAnswerQuestionAnswer";

    for (const question of questions) {
      if (question.questionType == "MultipleChoiceQuestion") {
        answers.push({
          order: question.order,
          answerType: "MultipleChoiceQuestionAnswer" as AnswerType,
          multipleChoiceQuestionAnswer: { create: { studentAnswer: 0 } },
        });
      } else if (question.questionType == "ShortAnswerQuestion") {
        answers.push({
          order: question.order,
          answerType: "ShortAnswerQuestionAnswer" as AnswerType,
          shortAnswerQuestionAnswer: { create: { studentAnswer: "" } },
        });
      } else if (question.questionType == "LongAnswerQuestion") {
        answers.push({
          order: question.order,
          answerType: "LongAnswerQuestionAnswer" as AnswerType,
          longAnswerQuestionAnswer: {
            create: { studentAnswer: "", studentImages: "" },
          },
        });
      }
    }

    return answers;
  };

  return (
    <div className="mt-8 flex items-center justify-center sm:mt-0 sm:min-h-screen">
      <div className="flex min-w-full flex-col items-center justify-center rounded-none bg-slate-200 px-6 py-12 shadow-xl sm:min-w-[50vw] sm:rounded-lg">
        <h2 className="mb-12 text-3xl">Student Credentials</h2>
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p>Name: </p>
            <input
              type="text"
              placeholder="Type your name"
              className="input-bordered input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <p>Email: </p>
            <input
              type="email"
              placeholder="Type your email"
              className="input-bordered input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn-primary btn mt-4" onClick={addAnswerSheet}>
            Confirm
          </button>
        </section>
        <p className="mt-8 text-lg text-gray-800">
          The email will be used to store your answer sheet in real-time
        </p>
        <p className="text-lg text-gray-800">
          and to contact you once the teacher has handed back the worksheet.
        </p>
      </div>
    </div>
  );
};
