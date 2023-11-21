import {
  BaseEssayQuestion,
  type EssayAnswer,
} from "@/questions/base/essayQuestion";
import type { PrismaClient } from "@prisma/client";

interface Criteria {
  evaluation: string;
  level: string;
}

interface Property {
  name: string;
  text: string;
}

interface Response {
  Expression?: Criteria;
  Organization?: Criteria;
  // Vocabulary?: Criteria;
  Register?: Criteria;
  Grammar?: Criteria;
  "Overall Impression"?: string;
}

export const descriptiveEssay = new BaseEssayQuestion(
  "Descriptive",
  "descriptive",
  [
    {
      name: "Content",
      description:
        "Articulate experience and express what is thought, felt and imagined",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Content is complex, engaging and effective. Many well-defined and developed ideas and images create a convincing overall picture with varieties of focus.",
        },
        {
          level: "5",
          text: "Content is developed, engaging and effective. Frequent, well-chosen images and details give a mostly convincing picture",
        },
        {
          level: "4",
          text: "Content is relevant with some development. A selection of relevant ideas, images and details, even where there is a tendency to write in a narrative style.",
        },
        {
          level: "3",
          text: "Content is straightforward and briefly developed. The task is addressed with a series of relevant but straightforward details, which may be more typical of a narrative.",
        },
        {
          level: "2",
          text: "Content is simple, and ideas and events may be limited. The recording of some relevant events with limited detail",
        },
        {
          level: "1",
          text: "Content is occasionally relevant or clear. The description is unclear and lacks detail",
        },
        {
          level: "0",
          text: "No creditable content",
        },
      ],
    },
    {
      name: "Structure",
      description:
        "Organize and structure ideas and opinions for deliberate effect",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Structure is secure, well balanced and carefully managed for deliberate effect.",
        },
        {
          level: "5",
          text: "Structure is well managed, with some choices made for deliberate effect",
        },
        {
          level: "4",
          text: "Structure is competently managed",
        },
        {
          level: "3",
          text: "Structure is mostly organised but may not always be effective",
        },
        {
          level: "2",
          text: "Structure is partially organised but limited in its effect.",
        },
        {
          level: "1",
          text: "Structure is limited and ineffective",
        },
        {
          level: "0",
          text: "No creditable content",
        },
      ],
    },
    // {
    //   name: "Vocabulary",
    //   description:
    //     "Use a range of vocabulary and sentence structures appropriate to context",
    //   marks: 5,
    //   levels: [
    //     {
    //       level: "6",
    //       text: "Wide range of sophisticated vocabulary, precisely used",
    //     },
    //     {
    //       level: "5",
    //       text: "Wide range of vocabulary, used with some precision",
    //     },
    //     {
    //       level: "4",
    //       text: "Range of vocabulary is adequate and sometimes effective",
    //     },
    //     {
    //       level: "3",
    //       text: "Vocabulary is simple, limited in range or reliant on the original text",
    //     },
    //     {
    //       level: "2",
    //       text: "Limited vocabulary or words/phrases copied from the original text",
    //     },
    //     {
    //       level: "1",
    //       text: "Very limited vocabulary or copying from the original text",
    //     },
    //     {
    //       level: "0",
    //       text: "No creditable content",
    //     },
    //   ],
    // },
    {
      name: "Register",
      description: "Use register appropriate to context",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Consistent well-chosen register suitable for the context",
        },
        {
          level: "5",
          text: "Mostly consistent appropriate register suitable for the context",
        },
        {
          level: "4",
          text: "Some appropriate register for the context",
        },
        {
          level: "3",
          text: "Simple register with a general awareness of the context.",
        },
        {
          level: "2",
          text: "Limited and/or imprecise register for the context.",
        },
        {
          level: "1",
          text: "Register demonstrates little or no sense of the context.",
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

    const expressionLevel = Number(answerResponse.Expression?.level ?? "0");
    const expressionMarks =
      (expressionLevel / 6) *
      (criteria.find((criterion) => criterion.name == "Expression")?.marks ??
        5);

    const organizationLevel = Number(answerResponse.Organization?.level ?? "0");
    const organizationMarks =
      (organizationLevel / 6) *
      (criteria.find((criterion) => criterion.name == "Organization")?.marks ??
        5);

    // const vocabularyLevel = Number(answerResponse.Vocabulary?.level ?? "0");
    // const vocabularyMarks =
    //   (vocabularyLevel / 6) *
    //   (criteria.find((criterion) => criterion.name == "Vocabulary")?.marks ??
    //     5);

    const registerLevel = Number(answerResponse.Register?.level ?? "0");
    const registerMarks =
      (registerLevel / 6) *
      (criteria.find((criterion) => criterion.name == "Register")?.marks ?? 5);

    const grammarLevel = Number(answerResponse.Grammar?.level ?? "0");
    const grammarMarks =
      (grammarLevel / 6) *
      (criteria.find((criterion) => criterion.name == "Grammar")?.marks ?? 5);

    const criteriaMarks = {
      Expression: expressionMarks,
      Organization: organizationMarks,
      // Vocabulary: vocabularyMarks,
      Register: registerMarks,
      Grammar: grammarMarks,
    };

    const marks =
      expressionMarks +
      organizationMarks +
      // vocabularyMarks +
      registerMarks +
      grammarMarks;

    await updateEssayAnswer(prisma, criteriaMarks, answer, answerResponse);

    return marks;
  }
);

interface CriteriaMarks {
  Expression: number;
  Organization: number;
  // Vocabulary: number;
  Register: number;
  Grammar: number;
}
const updateEssayAnswer = async (
  prisma: PrismaClient,
  criteriaMarks: CriteriaMarks,
  essayAnswer: EssayAnswer,
  response: Response
) => {
  const editCriteria = async (
    id: string,
    criteria: Criteria,
    marks: number
  ) => {
    await prisma.essayAnswerCriteria.update({
      where: {
        id: id,
      },
      data: {
        marks: marks,
        evaluation: criteria.evaluation,
        level: criteria.level.toString(),
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
      response[criterion.name as keyof Response] as Criteria,
      criteriaMarks[criterion.name as keyof CriteriaMarks]
    );
  }

  const properties = essayAnswer?.properties ?? [];
  for (const property of properties) {
    await editProperty(property.id, {
      name: property.name,
      text: response[property.name as keyof Response] as string,
    });
  }
};
