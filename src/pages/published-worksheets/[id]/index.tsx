import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TopNavLayout from "@/components/TopNavLayout";
import ToggleTheme from "@/components/ToggleTheme";

export function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.["id"];
  const worksheetId = id as string;

  return {
    props: {
      id: worksheetId,
    },
  };
}

const Answer: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  return (
    <>
      <Head>
        <title>Ace Grader</title>
        <meta
          name="description"
          content="AceGrader is an AI-powered innovative website software designed to streamline the daily tasks of teachers and enhance student learning. 
          With our intelligent grading and feedback system, you can say goodbye to the tedious and time-consuming process of manually 
          grading worksheets."
        />
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
          content="https://acegrader.com/images/logo-icon.png"
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
                <span className="text-2xl font-bold">AceGrader</span>
              </Link>
            </Button>

            <ToggleTheme />
          </nav>
        </header>
        <main className="container mx-auto flex-grow px-4 py-8">
          <SignedIn>
            <RedirectIfUserCreatedWorksheet id={id} />
          </SignedIn>
          <SignedOut>
            <StudentCredentialsForm id={id} />
          </SignedOut>
        </main>
      </div>
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

  //Fetching the worksheet
  const {
    data: publishedWorksheet,
    isLoading,
    isError,
  } = api.publishedWorksheet.get.useQuery({ id: props.id });

  //Fetching list of worksheets
  const { data: answerSheet, refetch: fetchCurrentAnswerSheet } =
    api.answerSheet.getCurrentAnswerSheet.useQuery(
      { email: email },
      { enabled: false }
    );

  //Function for creating answer sheet
  const createAnswerSheet = api.answerSheet.create.useMutation({
    onSuccess: (answerSheet) => {
      void router.push(`${props.id}/answer/${answerSheet.id}`);
    },
  });

  const addAnswerSheet = async () => {
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
      const { data: answerSheet } = await fetchCurrentAnswerSheet();

      if (answerSheet) {
        void router.push(`${props.id}/answer/${answerSheet.id}`);
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
          multipleChoiceQuestionAnswer: {
            create: { studentAnswer: 0, feedback: "" },
          },
        });
      } else if (question.questionType == "ShortAnswerQuestion") {
        answers.push({
          order: question.order,
          answerType: "ShortAnswerQuestionAnswer" as AnswerType,
          shortAnswerQuestionAnswer: {
            create: { studentAnswer: "", feedback: "" },
          },
        });
      } else if (question.questionType == "LongAnswerQuestion") {
        answers.push({
          order: question.order,
          answerType: "LongAnswerQuestionAnswer" as AnswerType,
          longAnswerQuestionAnswer: {
            create: { studentAnswer: "", feedback: "" },
          },
        });
      }
    }

    return answers;
  };

  return (
    <div className="mt-12 flex justify-center">
      <Card className="px-4 py-8">
        <CardHeader>
          <CardTitle>Create Answer Sheet</CardTitle>
          <CardDescription>
            You will be contacted by email after your worksheet is graded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* <Button variant="outline">Cancel</Button> */}
          <div></div>
          <Button onClick={() => void addAnswerSheet()}>Confirm</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
