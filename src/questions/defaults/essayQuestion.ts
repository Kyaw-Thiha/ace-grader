import {
  BaseEssayQuestion,
  type EssayAnswer,
} from "@/questions/base/essayQuestion";
import { PrismaClient } from "@prisma/client";

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
  Focus?: Criteria;
  Exposition?: Criteria;
  Organization?: Criteria;
  "Sentence Structure"?: Criteria;
  Plot?: Criteria;
  "Narrative Techniques"?: Criteria;
  "Descriptive Techniques"?: Criteria;
  "Literary Devices"?: Criteria;
  "Language and Vocabulary"?: Criteria;
  Content?: Criteria;
  Persuasion?: Criteria;
  Purpose?: Criteria;
  Register?: Criteria;
  "Overall Impression"?: string;
}

export const defaultEssayQuestion = new BaseEssayQuestion(
  "Essay",
  "default-essay",
  [
    {
      name: "Grammar",
      description:
        "Evaluate the essay's grammatical accuracy, sentence structure, and proper use of punctuation and spelling.",
      marks: 0,
    },
    {
      name: "Focus",
      description:
        "Assess whether the essay maintains a clear and consistent focus on the chosen topic or subject matter. Consider whether the essay stays on point throughout.",
      marks: 0,
    },
    {
      name: "Exposition",
      description:
        "Evaluate the effectiveness of the introduction in capturing the reader's attention and providing necessary context for the essay's content.",
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
      name: "Plot",
      description:
        "If applicable, evaluate the development and coherence of the essay's plot or storyline. Consider its relevance to the overall theme and how well it engages the reader.",
      marks: 0,
    },
    {
      name: "Narrative Techniques",
      description:
        "Analyze the essay's use of narrative techniques, such as imagery, dialogue, and descriptive language, to enhance the storytelling and reader's experience.",
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
    {
      name: "Content",
      description:
        "Assess the depth and accuracy of the essay's content in relation to the chosen topic. Consider whether the essay demonstrates a comprehensive understanding of the subject matter.",
      marks: 0,
    },
    {
      name: "Persuasion",
      description:
        "Evaluate the essay's ability to persuade and convince the reader in argumentative or persuasive writings. Analyze the strength of the arguments presented, the use of evidence, and the logical progression of ideas.",
      marks: 0,
    },
    {
      name: "Purpose",
      description:
        "Assess the awareness of the essay's form, intended audience, and purpose. Consider how well the writing aligns with the chosen form and effectively communicates with the target audience while fulfilling the intended purpose.",
      marks: 0,
    },
    {
      name: "Register",
      description:
        "Evaluate the use of appropriate language register in the essay. Assess whether the level of formality or informality is suitable for the intended audience and purpose, and whether it enhances the overall communication.",
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
  async (prisma: PrismaClient, answer: EssayAnswer, data: string) => {
    const answerResponse = JSON.parse(data) as Response;

    const marks =
      (answerResponse.Grammar?.marks ?? 0) +
      (answerResponse.Focus?.marks ?? 0) +
      (answerResponse.Exposition?.marks ?? 0) +
      (answerResponse["Sentence Structure"]?.marks ?? 0) +
      (answerResponse.Organization?.marks ?? 0) +
      (answerResponse.Plot?.marks ?? 0) +
      (answerResponse["Narrative Techniques"]?.marks ?? 0) +
      (answerResponse["Descriptive Techniques"]?.marks ?? 0) +
      (answerResponse["Literary Devices"]?.marks ?? 0) +
      (answerResponse["Language and Vocabulary"]?.marks ?? 0) +
      (answerResponse.Content?.marks ?? 0) +
      (answerResponse.Persuasion?.marks ?? 0) +
      (answerResponse.Purpose?.marks ?? 0) +
      (answerResponse.Register?.marks ?? 0);
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
