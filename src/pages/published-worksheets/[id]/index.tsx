import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { SignedIn, SignedOut } from "@clerk/nextjs";
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
import { formatDateWithSuffix } from "@/utils/helper";
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

const Answer: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  return (
    <>
      <AnswerSheetNavLayout>
        <SignedIn>
          <RedirectIfUserCreatedWorksheet id={id} />
        </SignedIn>
        <SignedOut>
          <StudentCredentialsForm id={id} />
        </SignedOut>
      </AnswerSheetNavLayout>
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

  const [showPrevAnswerSheets, setShowPrevAnswerSheets] = useState(false);

  const router = useRouter();

  //Fetching the worksheet
  const {
    data: publishedWorksheet,
    isLoading,
    isError,
  } = api.publishedWorksheet.get.useQuery({ id: props.id });

  //Fetching list of worksheets
  const { refetch: fetchCurrentAnswerSheet } =
    api.answerSheet.getCurrentAnswerSheet.useQuery(
      { email: email },
      { enabled: false }
    );

  //Fetching list of returned answersheets of student
  const { data: prevAnswerSheets, refetch: fetchPreviousAnswerSheets } =
    api.answerSheet.getReturnedAnswerSheetByEmail.useQuery(
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
        const { data: answerSheets } = await fetchPreviousAnswerSheets();
        if (
          !showPrevAnswerSheets &&
          answerSheets?.length &&
          answerSheets?.length > 0
        ) {
          setShowPrevAnswerSheets(true);
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
    }
  };

  const getAnswers = () => {
    const answers = [];
    const questions = publishedWorksheet?.questions ?? [];

    type AnswerType =
      | "NestedQuestionAnswer"
      | "MultipleChoiceQuestionAnswer"
      | "ShortAnswerQuestionAnswer"
      | "OpenEndedQuestionAnswer";

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
      } else if (question.questionType == "OpenEndedQuestion") {
        answers.push({
          order: question.order,
          answerType: "OpenEndedQuestionAnswer" as AnswerType,
          openEndedQuestionAnswer: {
            create: { studentAnswer: "", feedback: "" },
          },
        });
      } else if (question.questionType == "NestedQuestion") {
        // 2nd Nested Level
        const nestedQuestions =
          question.nestedQuestion?.childrenQuestions ?? [];
        const nestedAnswers = [];

        for (const nestedQuestion of nestedQuestions) {
          if (nestedQuestion.questionType == "MultipleChoiceQuestion") {
            nestedAnswers.push({
              order: nestedQuestion.order,
              answerType: "MultipleChoiceQuestionAnswer" as AnswerType,
              multipleChoiceQuestionAnswer: {
                create: { studentAnswer: 0, feedback: "" },
              },
            });
          } else if (nestedQuestion.questionType == "OpenEndedQuestion") {
            nestedAnswers.push({
              order: nestedQuestion.order,
              answerType: "OpenEndedQuestionAnswer" as AnswerType,
              openEndedQuestionAnswer: {
                create: { studentAnswer: "", feedback: "" },
              },
            });
          } else if (nestedQuestion.questionType == "NestedQuestion") {
            // 3rd Level
            const secondNestedQuestions =
              nestedQuestion.nestedQuestion?.childrenQuestions ?? [];
            const secondNestedAnswers = [];

            for (const secondNestedQuestion of secondNestedQuestions) {
              if (
                secondNestedQuestion.questionType == "MultipleChoiceQuestion"
              ) {
                secondNestedAnswers.push({
                  order: secondNestedQuestion.order,
                  answerType: "MultipleChoiceQuestionAnswer" as AnswerType,
                  multipleChoiceQuestionAnswer: {
                    create: { studentAnswer: 0, feedback: "" },
                  },
                });
              } else if (
                secondNestedQuestion.questionType == "OpenEndedQuestion"
              ) {
                secondNestedAnswers.push({
                  order: secondNestedQuestion.order,
                  answerType: "OpenEndedQuestionAnswer" as AnswerType,
                  openEndedQuestionAnswer: {
                    create: { studentAnswer: "", feedback: "" },
                  },
                });
              }
            }

            nestedAnswers.push({
              order: question.order,
              answerType: "NestedQuestionAnswer" as AnswerType,
              nestedQuestionAnswer: {
                create: {
                  childrenAnswers: {
                    create: secondNestedAnswers,
                  },
                },
              },
            });
          }
        }

        answers.push({
          order: question.order,
          answerType: "NestedQuestionAnswer" as AnswerType,
          nestedQuestionAnswer: {
            create: {
              childrenAnswers: {
                create: nestedAnswers,
              },
            },
          },
        });
      }
    }

    console.log(answers);

    return answers;
  };

  return (
    <div className="mt-12 flex justify-center">
      <div className="flex flex-col gap-8">
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

        {showPrevAnswerSheets && (
          <Card className="px-4 py-8">
            <CardHeader>
              <CardTitle>Previous Answer Sheeets</CardTitle>
              <CardDescription>
                Click confirm again to reattempt the worksheet
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {prevAnswerSheets?.map((answerSheet) => {
                return (
                  <div
                    key={answerSheet.id}
                    className=" flex items-center space-x-4 rounded-md border p-4"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {answerSheet.studentName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateWithSuffix(
                          answerSheet.endTime ?? new Date()
                        )}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={`${props.id}/answer/${answerSheet.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div>
              <Button onClick={() => void addAnswerSheet()}>Confirm</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};
