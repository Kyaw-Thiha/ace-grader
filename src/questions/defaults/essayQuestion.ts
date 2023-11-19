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
      name: "Expression",
      description:
        "Articulate experience and express what is thought, felt and imagined",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Highly effective style capable of conveying subtle meaning",
        },
        {
          level: "5",
          text: "Effective style",
        },
        {
          level: "4",
          text: "Sometimes effective style",
        },
        {
          level: "3",
          text: "Inconsistent style, expression sometimes awkward but meaning clear",
        },
        {
          level: "2",
          text: "Limited style",
        },
        {
          level: "1",
          text: "Expression unclear",
        },
        {
          level: "0",
          text: "No creditable content",
        },
      ],
    },
    {
      name: "Organization",
      description:
        "Organize and structure ideas and opinions for deliberate effect",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Carefully structured for benefit of the reader",
        },
        {
          level: "5",
          text: "Secure overall structure, organized to help the reader",
        },
        {
          level: "4",
          text: "Ideas generally well sequenced",
        },
        {
          level: "3",
          text: "Relies on the sequence of the original text",
        },
        {
          level: "2",
          text: "Response is not well sequenced",
        },
        {
          level: "1",
          text: "Poor sequencing of ideas",
        },
        {
          level: "0",
          text: "No creditable content",
        },
      ],
    },
    {
      name: "Vocabulary",
      description:
        "Use a range of vocabulary and sentence structures appropriate to context",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Wide range of sophisticated vocabulary, precisely used",
        },
        {
          level: "5",
          text: "Wide range of vocabulary, used with some precision",
        },
        {
          level: "4",
          text: "Range of vocabulary is adequate and sometimes effective",
        },
        {
          level: "3",
          text: "Vocabulary is simple, limited in range or reliant on the original text",
        },
        {
          level: "2",
          text: "Limited vocabulary or words/phrases copied from the original text",
        },
        {
          level: "1",
          text: "Very limited vocabulary or copying from the original text",
        },
        {
          level: "0",
          text: "No creditable content",
        },
      ],
    },
    {
      name: "Register",
      description: "Use register appropriate to context",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Highly effective register for audience and purpose",
        },
        {
          level: "5",
          text: "Effective register for audience and purpose",
        },
        {
          level: "4",
          text: "Sometimes effective register for audience and purpose",
        },
        {
          level: "3",
          text: "Some awareness of an appropriate register for audience and purpose",
        },
        {
          level: "2",
          text: "Limited awareness of appropriate register for audience and purpose",
        },
        {
          level: "1",
          text: "Very limited awareness of appropriate register for audience and purpose",
        },
        {
          level: "0",
          text: "No creditable content",
        },
      ],
    },
    {
      name: "Grammar",
      description: "Make accurate use of spelling, punctuation and grammar",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Spelling, punctuation and grammar almost always accurate.",
        },
        {
          level: "5",
          text: "Spelling, punctuation and grammar mostly accurate, with occasional minor errors",
        },
        {
          level: "4",
          text: "Spelling, punctuation and grammar generally accurate though with some errors",
        },
        {
          level: "3",
          text: "Frequent errors of spelling, punctuation and grammar, sometimes serious",
        },
        {
          level: "2",
          text: "Persistent errors of spelling, punctuation and grammar",
        },
        {
          level: "1",
          text: "Persistent errors in spelling, punctuation and grammar impede communication",
        },
        {
          level: "0",
          text: "No creditable content",
        },
      ],
    },
  ],
  [
    {
      name: "Overall Impression",
      description:
        "Share an overall impression of the essay, discussing its strengths and suggesting ways it could be further enhanced.",
    },
  ],
  async (prisma: PrismaClient, criteria, answer: EssayAnswer, data: string) => {
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
