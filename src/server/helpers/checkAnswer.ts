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

export interface EssayQuestionCriteria {
  marks: number;
  evaluation: string;
  suggestion: string;
}
export interface EssayResponse {
  Grammar?: EssayQuestionCriteria;
  Focus?: EssayQuestionCriteria;
  Exposition?: EssayQuestionCriteria;
  Organization?: EssayQuestionCriteria;
  "Sentence Structure"?: EssayQuestionCriteria;
  Plot?: EssayQuestionCriteria;
  "Narrative Techniques"?: EssayQuestionCriteria;
  "Descriptive Techniques"?: EssayQuestionCriteria;
  "Literary Devices"?: EssayQuestionCriteria;
  "Language and Vocabulary"?: EssayQuestionCriteria;
  Content?: EssayQuestionCriteria;
  Persuasion?: EssayQuestionCriteria;
  Purpose?: EssayQuestionCriteria;
  Register?: EssayQuestionCriteria;
  "Overall Impression"?: string;
}

export const checkAnswerRenamed = async (
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

  console.timeEnd("Setting Up Questions");

  console.time("Checking OpenEndedQuestions");
  // Fetching the marks and feedback
  const res = await backOff(() =>
    openaiAPI.openEndedQuestion.batchGenerateMarksAndFeedback(
      openEndedQuestions,
      openEndedQuestionAnswers
    )
  );
  console.timeEnd("Checking OpenEndedQuestions");

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

  for (const question of questions) {
    if (question.questionType == "MultipleChoiceQuestion") {
      const answer = answers.at(question.order - 1)
        ?.multipleChoiceQuestionAnswer as MultipleChoiceQuestionAnswer;
      const multipleChoiceQuestion =
        question.multipleChoiceQuestion as MultipleChoiceQuestion;

      // Adding question text of parent question if it exists
      if (multipleChoiceQuestion && parentQuestionText) {
        multipleChoiceQuestion.text =
          parentQuestionText + multipleChoiceQuestion.text;
      }

      const isCorrect = await checkMCQ(multipleChoiceQuestion, answer);
      if (isCorrect) {
        totalMarks = totalMarks + 1;
      }
    } else if (question.questionType == "OpenEndedQuestion") {
      const answer = answers.at(question.order - 1)
        ?.openEndedQuestionAnswer as OpenEndedQuestionAnswer;
      const openEndedQuestion = question.openEndedQuestion as OpenEndedQuestion;

      // Adding question text of parent question if it exists
      if (openEndedQuestion && parentQuestionText) {
        openEndedQuestion.text = parentQuestionText + openEndedQuestion.text;
      }

      openEndedQuestions.push(openEndedQuestion);
      openEndedQuestionAnswers.push(answer);
    } else if (question.questionType == "EssayQuestion") {
      console.time("Checking Essay");
      const answer = answers.at(question.order - 1)?.essayAnswer as EssayAnswer;
      const essayQuestion = question.essayQuestion as EssayQuestion;

      // Adding question text of parent question if it exists
      if (essayQuestion && parentQuestionText) {
        essayQuestion.text = parentQuestionText + essayQuestion.text;
      }
      // Fetching the marks and feedback
      const res = await backOff(() =>
        openaiAPI.essayQuestion.generateMarksAndFeedback(essayQuestion, answer)
      );
      const data = res.data.choices[0]?.message?.content ?? "";
      const answerResponse = JSON.parse(data) as EssayResponse;

      const marks =
        (answerResponse.Grammar?.marks ?? 0) +
        (answerResponse.Focus?.marks ?? 0) +
        (answerResponse.Exposition?.marks ?? 0) +
        (answerResponse.Organization?.marks ?? 0) +
        (answerResponse["Sentence Structure"]?.marks ?? 0) +
        (answerResponse.Plot?.marks ?? 0) +
        (answerResponse["Narrative Techniques"]?.marks ?? 0) +
        (answerResponse["Descriptive Techniques"]?.marks ?? 0) +
        (answerResponse["Literary Devices"]?.marks ?? 0) +
        (answerResponse["Language and Vocabulary"]?.marks ?? 0) +
        (answerResponse.Content?.marks ?? 0) +
        (answerResponse.Persuasion?.marks ?? 0) +
        (answerResponse.Purpose?.marks ?? 0) +
        (answerResponse.Register?.marks ?? 0);
      await updateEssayAnswer(answer, answerResponse, marks);

      // Adding up to the total marks
      totalMarks = totalMarks + marks;

      console.timeEnd("Checking Essay");
    } else if (question.questionType == "NestedQuestion") {
      const childrenQuestions =
        question.nestedQuestion?.childrenQuestions ?? [];
      const childrenAnswers =
        answers.at(question.order - 1)?.nestedQuestionAnswer?.childrenAnswers ??
        [];

      const {
        totalMarks: returnedMarks,
        openEndedQuestions: returnedQuestions,
        openEndedQuestionAnswers: returnedAnswers,
      } = await handleMarking(
        childrenQuestions,
        childrenAnswers as Answer[],
        openEndedQuestions,
        openEndedQuestionAnswers,
        questions.at(question.order - 1)?.nestedQuestion?.text
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
  response: EssayResponse,
  marks: number
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

  const criteria = essayAnswer?.criteria ?? [];
  for (const criterion of criteria) {
    await editCriteria(
      criterion.id,
      response[criterion.name as keyof EssayResponse] as EssayQuestionCriteria
    );
  }

  await prisma.essayAnswer.update({
    where: {
      id: essayAnswer?.id,
    },
    data: {
      marks: marks,
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
