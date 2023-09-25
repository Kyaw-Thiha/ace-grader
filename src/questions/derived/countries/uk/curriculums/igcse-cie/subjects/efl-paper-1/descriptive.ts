import {
  BaseEssayQuestion,
  type EssayAnswer,
} from "@/questions/base/essayQuestion";
import { prisma } from "@/server/db";

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
  Grammar?: Criteria;
  Organization?: Criteria;
  "Sentence Structure"?: Criteria;
  "Descriptive Techniques"?: Criteria;
  "Literary Devices"?: Criteria;
  "Language and Vocabulary"?: Criteria;
  "Overall Impression"?: string;
}

export const descriptiveEssay = new BaseEssayQuestion(
  "Descriptive",
  "descriptive",
  [
    {
      name: "Grammar",
      description:
        "Evaluate the essay's grammatical accuracy, sentence structure, and proper use of punctuation and spelling.",
      marks: 0,
    },
    {
      name: "Organization",
      description:
        "Assess the logical flow and organization of ideas within the essay. Consider the coherence of paragraphs and transitions between different sections.",
      marks: 0,
    },
    {
      name: "Sentence Structure",
      description:
        "Assess the variety and effectiveness of sentence structures and syntax used in the essay. Consider the balance between simple and complex sentences, and evaluate how well the syntax contributes to the essay's readability and engagement.",
      marks: 0,
    },
    {
      name: "Descriptive Techniques",
      description:
        "Analyze the use of rich and evocative language, sensory details, and the ability to paint a clear mental picture for the reader. Consider how these techniques contribute to the depth, atmosphere, and immersive quality of the descriptive elements in the writing.",
      marks: 0,
    },
    {
      name: "Literary Devices",
      description:
        "Evaluate the incorporation of literary devices like similes, metaphors, and other figurative language in the essay. Assess their relevance, impact, and contribution to the overall quality of the writing.",
      marks: 0,
    },
    {
      name: "Language and Vocabulary",
      description:
        "Evaluate the richness and appropriateness of the language used. Consider the diversity of vocabulary and its contribution to the overall quality of the essay.",
      marks: 0,
    },
  ],
  [
    {
      name: "Overall Impression",
      description:
        "Share an overall impression of the essay, discussing its strengths and suggesting ways it could be further enhanced.",
    },
  ],
  async (answer: EssayAnswer, data: string) => {
    const answerResponse = JSON.parse(data) as Response;

    const marks =
      (answerResponse.Grammar?.marks ?? 0) +
      (answerResponse.Organization?.marks ?? 0) +
      (answerResponse["Sentence Structure"]?.marks ?? 0) +
      (answerResponse["Descriptive Techniques"]?.marks ?? 0) +
      (answerResponse["Literary Devices"]?.marks ?? 0) +
      (answerResponse["Language and Vocabulary"]?.marks ?? 0);

    await updateEssayAnswer(answer, answerResponse, marks);

    return marks;
  }
);

const updateEssayAnswer = async (
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
