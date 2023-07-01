import type { PrismaClient } from "@prisma/client";
import type { RouterOutputs } from "@/utils/api";
import { openaiAPI } from "@/server/openai/api";

type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];

export const checkAnswer = async (
  prisma: PrismaClient,
  worksheetId: string,
  answerSheetId: string
) => {
  await markAsChecking(prisma, answerSheetId);

  const worksheet = await fetchWorksheet(prisma, worksheetId);
  const answerSheet = await fetchAnswerSheet(prisma, answerSheetId);

  const questions = worksheet?.questions ?? [];
  const answers = answerSheet?.answers ?? [];

  let totalMarks = 0;
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
        ?.longAnswerQuestion as LongAnswerQuestion;
      const longAnswerQuestionAnswer = answer.longAnswerQuestionAnswer;

      // Fetching the explanation and updating it
      const res = await openaiAPI.longAnswerQuestion.generateMarksAndFeedback(
        question,
        longAnswerQuestionAnswer
      );
      const data = res.data.choices[0]?.text ?? "";
      const keyword = "Feedback: ";
      const index = data.indexOf(keyword);

      const markString = data.substring(0, index);
      const marks = parseInt(markString.trim());
      const feedback = data.substring(keyword.length);

      await prisma.longAnswerQuestionAnswer.update({
        where: {
          id: longAnswerQuestionAnswer?.id,
        },
        data: {
          marks: marks,
          feedback: feedback,
        },
      });

      // Updating the total marks
      totalMarks = totalMarks + marks;
    }
  }
  await setTotalMarks(prisma, answerSheetId, totalMarks);
  await markAsReturned(prisma, answerSheetId);
};

// Fetching the worksheet from the server
const fetchWorksheet = (prisma: PrismaClient, worksheetId: string) => {
  return prisma.publishedWorksheet.findFirst({
    where: {
      id: worksheetId,
    },
    select: {
      questions: {
        orderBy: {
          order: "asc",
        },
        include: {
          parentQuestions: {
            // 1st Level
            include: {
              // 2nd Level
              childrenQuestions: {
                include: {
                  // 3rd Level
                  childrenQuestions: {
                    include: {
                      // 4th Level
                      childrenQuestions: true,
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
