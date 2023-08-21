//  import type { ReactElement } from "react";
import type { PrismaClient } from "@prisma/client";
import type { RouterOutputs } from "@/utils/api";
import { openaiAPI } from "@/server/openai/api";
import { Resend } from "resend";
import { CheckingFinishedEmailTemplate } from "@/components/emails/CheckingFinished";
import { backOff } from "exponential-backoff";
import { prisma } from "@/server/db";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
type MultipleChoiceQuestionAnswer =
  RouterOutputs["multipleChoiceQuestionAnswer"]["get"];
type OpenEndedQuestion = RouterOutputs["openEndedQuestion"]["get"];
type OpenEndedQuestionAnswer = RouterOutputs["openEndedQuestionAnswer"]["get"];
type NestedQuestion = RouterOutputs["nestedQuestion"]["get"];
type NestedQuestionAnswer = RouterOutputs["nestedQuestionAnswer"]["get"];
type EssayQuestion = RouterOutputs["essayQuestion"]["get"];
type EssayAnswer = RouterOutputs["essayAnswer"]["get"];

interface Question {
  order: number;
  questionType:
    | "NestedQuestion"
    | "ShortAnswerQuestion"
    | "MultipleChoiceQuestion"
    | "OpenEndedQuestion"
    | "EssayQuestion";
  multipleChoiceQuestion?: MultipleChoiceQuestion;
  openEndedQuestion?: OpenEndedQuestion;
  nestedQuestion?: NestedQuestion;
  essayQuestion?: EssayQuestion;
}

interface Answer {
  order: number;
  answerType:
    | "NestedQuestionAnswer"
    | "ShortAnswerQuestionAnswer"
    | "MultipleChoiceQuestionAnswer"
    | "OpenEndedQuestionAnswer"
    | "EssayAnswer";
  multipleChoiceQuestionAnswer?: MultipleChoiceQuestionAnswer;
  openEndedQuestionAnswer?: OpenEndedQuestionAnswer;
  nestedQuestionAnswer?: NestedQuestionAnswer;
  essayAnswer?: EssayAnswer;
}

interface MarksAndFeedback {
  marks: number;
  feedback: string;
}

interface EssayQuestionCriteria {
  marks: number;
  evaluation: string;
  suggestion: string;
}
interface EssayResponse {
  Grammar?: EssayQuestionCriteria;
  Focus?: EssayQuestionCriteria;
  Exposition?: EssayQuestionCriteria;
  Organization?: EssayQuestionCriteria;
  Plot?: EssayQuestionCriteria;
  "Narrative Techniques"?: EssayQuestionCriteria;
  "Language and Vocabulary"?: EssayQuestionCriteria;
  Content?: EssayQuestionCriteria;
  "Overall Impression"?: string;
}

export const checkAnswer = async (
  worksheetId: string,
  answerSheetId: string
) => {
  console.time("Function Execution Time");

  await markAsChecking(prisma, answerSheetId);

  const worksheet = await fetchWorksheet(worksheetId);
  const answerSheet = await fetchAnswerSheet(answerSheetId);

  const questions = worksheet?.questions ?? [];
  const answers = answerSheet?.answers ?? [];

  let openEndedQuestions: OpenEndedQuestion[] = [];
  let openEndedQuestionAnswers: OpenEndedQuestionAnswer[] = [];

  let totalMarks = 0;

  console.time("Setting Up Questions");
  const {
    totalMarks: returnedMarks,
    openEndedQuestions: returnedQuestions,
    openEndedQuestionAnswers: returnedAnswers,
  } = await handleMarking(
    questions as Question[],
    answers,
    openEndedQuestions,
    openEndedQuestionAnswers
  );
  totalMarks = returnedMarks;
  openEndedQuestions = [...returnedQuestions];
  openEndedQuestionAnswers = [...returnedAnswers];

  console.log("Open Ended Ques - ", openEndedQuestions);
  console.log("Open Ended Ans - ", openEndedQuestionAnswers);

  console.timeEnd("Setting Up Questions");

  console.time("ChatGPT");
  // Fetching the marks and feedback
  const res = await backOff(() =>
    openaiAPI.openEndedQuestion.batchGenerateMarksAndFeedback(
      openEndedQuestions,
      openEndedQuestionAnswers
    )
  );
  console.timeEnd("ChatGPT");

  const data = res.data.choices[0]?.message?.content ?? "";
  const answerResponses = JSON.parse(data) as MarksAndFeedback[];

  console.time("Updating Questions");

  for (let i = 0; i < openEndedQuestionAnswers.length; i++) {
    const answer = openEndedQuestionAnswers[i];
    const answerResponse = answerResponses[i];

    const marks = answerResponse?.marks ?? 0;
    const feedback = answerResponse?.feedback ?? "";

    await prisma.openEndedQuestionAnswer.update({
      where: {
        id: answer?.id,
      },
      data: {
        marks: marks,
        feedback: feedback,
      },
    });

    totalMarks = totalMarks + marks;
  }
  console.timeEnd("Updating Questions");

  await setTotalMarks(prisma, answerSheetId, totalMarks);
  await markAsReturned(prisma, answerSheetId);

  const baseUrl =
    process.env.NODE_ENV == "development"
      ? process.env.VERCEL_URL ?? "localhost:3000"
      : "https://acegrader.com";

  await sendEmail(
    answerSheet?.studentEmail ?? "",
    answerSheet?.studentName ?? "",
    worksheet?.title ?? "",
    `${baseUrl}/published-worksheets/${worksheetId}/answer/${answerSheetId}`
  );

  console.timeEnd("Function Execution Time");
};

const handleMarking = async (
  questions: Question[],
  answers: Answer[],
  openEndedQuestions: OpenEndedQuestion[],
  openEndedQuestionAnswers: OpenEndedQuestionAnswer[],
  parentQuestionText?: string
) => {
  let totalMarks = 0;

  for (const answer of answers) {
    if (answer.answerType == "MultipleChoiceQuestionAnswer") {
      const question = questions.at(answer.order - 1)
        ?.multipleChoiceQuestion as MultipleChoiceQuestion;
      const multipleChoiceQuestionAnswer = answer.multipleChoiceQuestionAnswer;

      // Adding question text of parent question if it exists
      if (question && parentQuestionText) {
        question.text = parentQuestionText + question.text;
      }

      const isCorrect = await checkMCQ(
        question,
        multipleChoiceQuestionAnswer as MultipleChoiceQuestionAnswer
      );
      if (isCorrect) {
        totalMarks = totalMarks + 1;
      }
    } else if (answer.answerType == "OpenEndedQuestionAnswer") {
      const question = questions.at(answer.order - 1)
        ?.openEndedQuestion as OpenEndedQuestion;
      const openEndedQuestionAnswer = answer.openEndedQuestionAnswer;

      // Adding question text of parent question if it exists
      if (question && parentQuestionText) {
        question.text = parentQuestionText + question.text;
      }

      openEndedQuestions.push(question);
      openEndedQuestionAnswers.push(
        openEndedQuestionAnswer as OpenEndedQuestionAnswer
      );
    } else if (answer.answerType == "EssayAnswer") {
      console.time("Checking Essay");
      const question = questions.at(answer.order - 1)
        ?.essayQuestion as EssayQuestion;
      const essayAnswer = answer.essayAnswer as EssayAnswer;

      // Adding question text of parent question if it exists
      if (question && parentQuestionText) {
        question.text = parentQuestionText + question.text;
      }
      console.log("here");
      // Fetching the marks and feedback
      const res = await backOff(() =>
        openaiAPI.essayQuestion.generateMarksAndFeedback(question, essayAnswer)
      );
      console.log("res - ", res);
      const data = res.data.choices[0]?.message?.content ?? "";
      console.log("data - ", data);
      console.log("JSON - ", JSON.parse(data));
      const answerResponse = JSON.parse(data) as EssayResponse;
      console.log("answerRes - ", answerResponse);

      await updateEssayAnswer(essayAnswer, answerResponse);

      console.timeEnd("Checking Essay");
    } else if (answer.answerType == "NestedQuestionAnswer") {
      const childrenQuestions =
        questions.at(answer.order - 1)?.nestedQuestion?.childrenQuestions ?? [];
      const childrenAnswers =
        answer.nestedQuestionAnswer?.childrenAnswers ?? [];

      const {
        totalMarks: returnedMarks,
        openEndedQuestions: returnedQuestions,
        openEndedQuestionAnswers: returnedAnswers,
      } = await handleMarking(
        childrenQuestions,
        childrenAnswers as Answer[],
        openEndedQuestions,
        openEndedQuestionAnswers,
        questions.at(answer.order - 1)?.nestedQuestion?.text
      );

      totalMarks = totalMarks + returnedMarks;
      openEndedQuestions = [...openEndedQuestions, ...returnedQuestions];
      openEndedQuestionAnswers = [
        ...openEndedQuestionAnswers,
        ...returnedAnswers,
      ];
    }
  }

  return { totalMarks, openEndedQuestions, openEndedQuestionAnswers };
};

const checkMCQ = async (
  question: MultipleChoiceQuestion,
  answer: MultipleChoiceQuestionAnswer
) => {
  // Checking the MCQ Questions
  if (answer?.studentAnswer == question?.answer) {
    await prisma.multipleChoiceQuestionAnswer.update({
      where: {
        id: answer?.id,
      },
      data: {
        marks: 1,
      },
    });

    return true;
  } else {
    await prisma.multipleChoiceQuestionAnswer.update({
      where: {
        id: answer?.id,
      },
      data: {
        marks: 0,
      },
    });

    return false;
  }
};

const updateEssayAnswer = async (
  essayAnswer: EssayAnswer,
  response: EssayResponse
) => {
  const editCriteria = async (id: string, criteria: EssayQuestionCriteria) => {
    await prisma.essayAnswerCriteria.update({
      where: {
        id: id,
      },
      data: {
        marks: criteria.marks,
        evaluation: criteria.evaluation,
        suggestion: criteria.suggestion,
      },
    });
  };

  console.log("yep");

  const criteria = essayAnswer?.criteria ?? [];
  for (const criterion of criteria) {
    await editCriteria(
      criterion.id,
      response[criterion.name as keyof EssayResponse] as EssayQuestionCriteria
    );
  }
  console.log("criteria");

  await prisma.essayAnswer.update({
    where: {
      id: essayAnswer?.id,
    },
    data: {
      overallImpression: response["Overall Impression"],
    },
  });
};

// Fetching the worksheet from the server
const fetchWorksheet = (worksheetId: string) => {
  return prisma.publishedWorksheet.findFirst({
    where: {
      id: worksheetId,
    },
    select: {
      title: true,
      questions: {
        orderBy: {
          order: "asc",
        },
        include: {
          nestedQuestion: {
            include: {
              // 1st level
              childrenQuestions: {
                include: {
                  multipleChoiceQuestion: true,
                  openEndedQuestion: true,
                  essayQuestion: {
                    include: {
                      criteria: true,
                      images: true,
                    },
                  },
                  nestedQuestion: {
                    include: {
                      // 2nd level
                      childrenQuestions: {
                        include: {
                          multipleChoiceQuestion: true,
                          openEndedQuestion: true,
                          essayQuestion: {
                            include: {
                              criteria: true,
                              images: true,
                            },
                          },
                          nestedQuestion: {
                            include: {
                              // 3rd level
                              childrenQuestions: {
                                include: {
                                  multipleChoiceQuestion: true,
                                  openEndedQuestion: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          multipleChoiceQuestion: {
            include: {
              choices: true,
            },
          },
          shortAnswerQuestion: true,
          openEndedQuestion: true,
          essayQuestion: {
            include: {
              criteria: true,
              images: true,
            },
          },
        },
      },
    },
  });
};

// Fetching the answer sheet from the server
const fetchAnswerSheet = (answerSheetId: string) => {
  return prisma.answerSheet.findFirst({
    where: {
      id: answerSheetId,
    },
    select: {
      studentName: true,
      studentEmail: true,
      status: true,
      totalMarks: true,
      startTime: true,
      endTime: true,
      answers: {
        orderBy: {
          order: "asc",
        },
        include: {
          multipleChoiceQuestionAnswer: true,
          openEndedQuestionAnswer: true,
          essayAnswer: {
            include: {
              criteria: true,
            },
          },
          nestedQuestionAnswer: {
            // 2nd level
            include: {
              childrenAnswers: {
                include: {
                  multipleChoiceQuestionAnswer: true,
                  openEndedQuestionAnswer: true,
                  essayAnswer: {
                    include: {
                      criteria: true,
                    },
                  },
                  nestedQuestionAnswer: {
                    //3rd level
                    include: {
                      childrenAnswers: {
                        include: {
                          multipleChoiceQuestionAnswer: true,
                          openEndedQuestionAnswer: true,
                          essayAnswer: {
                            include: {
                              criteria: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

// Changing the status of the answer sheet as checking
const markAsChecking = (prisma: PrismaClient, answerSheetId: string) => {
  return prisma.answerSheet.update({
    where: {
      id: answerSheetId,
    },
    data: {
      status: "checking",
    },
  });
};

// Changing the status of the answer sheet as returned
const markAsReturned = (prisma: PrismaClient, answerSheetId: string) => {
  return prisma.answerSheet.update({
    where: {
      id: answerSheetId,
    },
    data: {
      status: "returned",
    },
  });
};

// Changing the status of the answer sheet as returned
const setTotalMarks = (
  prisma: PrismaClient,
  answerSheetId: string,
  totalMarks: number
) => {
  return prisma.answerSheet.update({
    where: {
      id: answerSheetId,
    },
    data: {
      totalMarks: totalMarks,
    },
  });
};

export const sendEmail = (
  email: string,
  studentName: string,
  title: string,
  url: string
) => {
  const domain =
    process.env.NODE_ENV == "development"
      ? "testing.acegrader.com"
      : "notification.acegrader.com";
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: `AceGrader <no-reply@${domain}>`,
    to: [email],
    subject: "Answer Sheet has been checked",
    react: CheckingFinishedEmailTemplate({
      studentName,
      title,
      url,
    }),
  });
};
