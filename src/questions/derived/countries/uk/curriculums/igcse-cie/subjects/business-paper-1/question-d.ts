import {
  BaseEssayQuestion,
  type EssayAnswer,
} from "@/questions/base/essayQuestion";
import type { PrismaClient } from "@prisma/client";

interface Criteria {
  marks: number;
  evaluation: string;
  suggestion: string;
}
interface Property {
  name: string;
  text: string;
}

interface Response {
  Knowledge?: Criteria;
  Applicaiton?: Criteria;
  Analysis?: Criteria;
  "Overall Impression"?: string;
}

export const questionD = new BaseEssayQuestion(
  "Question-D",
  "question-d",
  [
    {
      name: "Knowledge",
      description:
        "Evaluate the answer's depth of theoretical knowledge and understanding of the relevant business concepts or lessons. Consider the accuracy and completeness of the theoretical framework presented.",
      marks: 2,
    },
    {
      name: "Application",
      description:
        "Assess the paper's ability to apply theoretical knowledge to real-world scenarios, particularly through reference to case studies or practical examples. Evaluate the effectiveness of these applications in illustrating the concepts discussed.",
      marks: 2,
    },
    {
      name: "Analysis",
      description:
        "Evaluate the paper's capacity to analyze and explain the cause-and-effect relationships within the chosen business topic. Consider how well the paper delves into the underlying factors and consequences, providing a thorough analysis of the subject matter.",
      marks: 2,
    },
  ],
  [
    {
      name: "Overall Impression",
      description:
        "Share an overall impression of the answer, discussing its strengths and suggesting ways it could be further enhanced.",
    },
  ],
  async (prisma: PrismaClient, answer: EssayAnswer, data: string) => {
    const answerResponse = JSON.parse(data) as Response;

    const marks =
      (answerResponse.Knowledge?.marks ?? 0) +
      (answerResponse.Applicaiton?.marks ?? 0) +
      (answerResponse.Analysis?.marks ?? 0);
    await updateEssayAnswer(prisma, answer, answerResponse, marks);

    return marks;
  }
);

const updateEssayAnswer = async (
  prisma: PrismaClient,
  essayAnswer: EssayAnswer,
  response: Response,
  marks: number
) => {
  const editCriteria = async (id: string, criteria: Criteria) => {
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

  const editProperty = async (id: string, property: Property) => {
    await prisma.essayAnswerProperty.update({
      where: {
        id: id,
      },
      data: {
        name: property.name,
        text: property.text,
      },
    });
  };

  const criteria = essayAnswer?.criteria ?? [];
  for (const criterion of criteria) {
    await editCriteria(
      criterion.id,
      response[criterion.name as keyof Response] as Criteria
    );
  }

  const properties = essayAnswer?.properties ?? [];
  for (const property of properties) {
    await editProperty(property.id, {
      name: property.name,
      text: response[property.name as keyof Response] as string,
    });
  }

  await prisma.essayAnswer.update({
    where: {
      id: essayAnswer?.id,
    },
    data: {
      marks: marks,
    },
  });
};
