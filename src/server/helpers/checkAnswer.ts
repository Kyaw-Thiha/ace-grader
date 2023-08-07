//  import type { ReactElement } from "react";
import type { PrismaClient } from "@prisma/client";
import type { RouterOutputs } from "@/utils/api";
import { openaiAPI } from "@/server/openai/api";
import { Resend } from "resend";
import { CheckingFinishedEmailTemplate } from "@/components/emails/CheckingFinished";
import { backOff } from "exponential-backoff";
import { prisma } from "@/server/db";

type OpenEndedQuestion = RouterOutputs["openEndedQuestion"]["get"];
type OpenEndedQuestionAnswer = RouterOutputs["openEndedQuestionAnswer"]["get"];
interface MarksAndFeedback {
  marks: number;
  feedback: string;
}

export const checkAnswer = async (
  worksheetId: string,
  answerSheetId: string
) => {
  console.time("Function Execution Time");

  await markAsChecking(prisma, answerSheetId);

  const worksheet = await fetchWorksheet(prisma, worksheetId);
  const answerSheet = await fetchAnswerSheet(prisma, answerSheetId);

  const questions = worksheet?.questions ?? [];
  const answers = answerSheet?.answers ?? [];

  const openEndedQuestions: OpenEndedQuestion[] = [];
  const openEndedQuestionAnswers: OpenEndedQuestionAnswer[] = [];

  let totalMarks = 0;

  console.time("Setting Up Questions");
  for (const answer of answers) {
    if (answer.answerType == "MultipleChoiceQuestionAnswer") {
      const question = questions.at(answer.order - 1)?.multipleChoiceQuestion;
      const multipleChoiceQuestionAnswer = answer.multipleChoiceQuestionAnswer;

      // Checking the MCQ Questions
      if (multipleChoiceQuestionAnswer?.studentAnswer == question?.answer) {
        await prisma.multipleChoiceQuestionAnswer.update({
          where: {
            id: multipleChoiceQuestionAnswer?.id,
          },
          data: {
            marks: 1,
          },
        });

        // Updating the total marks
        totalMarks = totalMarks + 1;
      } else {
        await prisma.multipleChoiceQuestionAnswer.update({
          where: {
            id: multipleChoiceQuestionAnswer?.id,
          },
          data: {
            marks: 0,
          },
        });
      }
    } else if (answer.answerType == "LongAnswerQuestionAnswer") {
      const question = questions.at(answer.order - 1)
        ?.longAnswerQuestion as OpenEndedQuestion;
      const openEndedQuestionAnswer = answer.longAnswerQuestionAnswer;

      openEndedQuestions.push(question);
      openEndedQuestionAnswers.push(openEndedQuestionAnswer);
    }
  }
  console.timeEnd("Setting Up Questions");

  console.time("ChatGPT");
  // Fetching the explanation and updating it
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

    await prisma.longAnswerQuestionAnswer.update({
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

// Fetching the worksheet from the server
const fetchWorksheet = (prisma: PrismaClient, worksheetId: string) => {
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
              images: true,
              childrenQuestions: {
                include: {
                  multipleChoiceQuestion: true,
                  longAnswerQuestion: true,
                  nestedQuestion: {
                    include: {
                      // 2nd level
                      images: true,
                      childrenQuestions: {
                        include: {
                          multipleChoiceQuestion: true,
                          longAnswerQuestion: true,
                          nestedQuestion: {
                            include: {
                              // 3rd level
                              images: true,
                              childrenQuestions: {
                                include: {
                                  multipleChoiceQuestion: true,
                                  longAnswerQuestion: true,
                                  nestedQuestion: {
                                    include: {
                                      // 4th level
                                      images: true,
                                      childrenQuestions: {
                                        include: {
                                          multipleChoiceQuestion: true,
                                          longAnswerQuestion: true,
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
              },
            },
          },
          multipleChoiceQuestion: {
            include: {
              choices: true,
            },
          },
          shortAnswerQuestion: true,
          longAnswerQuestion: true,
        },
      },
    },
  });
};

// Fetching the answer sheet from the server
const fetchAnswerSheet = (prisma: PrismaClient, answerSheetId: string) => {
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
          shortAnswerQuestionAnswer: true,
          longAnswerQuestionAnswer: true,
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

// const question = questions.at(answer.order - 1)
//   ?.longAnswerQuestion as LongAnswerQuestion;
// const longAnswerQuestionAnswer = answer.longAnswerQuestionAnswer;
// // Fetching the explanation and updating it
// const res = await backOff(() =>
//   openaiAPI.longAnswerQuestion.generateMarksAndFeedback(
//     question,
//     longAnswerQuestionAnswer
//   )
// );

// const data = res.data.choices[0]?.message?.content ?? "";
// const markKeyword = "Mark: ";
// const feedbackKeyword = "Feedback: ";
// const markIndex = data.indexOf(markKeyword);
// const feedbackIndex = data.indexOf(feedbackKeyword);

// const markString = data.substring(
//   markIndex + markKeyword.length,
//   feedbackIndex
// );
// const marks = parseInt(markString.trim());
// const feedback = data.substring(feedbackIndex + feedbackKeyword.length);

// await prisma.longAnswerQuestionAnswer.update({
//   where: {
//     id: longAnswerQuestionAnswer?.id,
//   },
//   data: {
//     marks: marks,
//     feedback: feedback,
//   },
// });

// // Updating the total marks
// totalMarks = totalMarks + marks;
