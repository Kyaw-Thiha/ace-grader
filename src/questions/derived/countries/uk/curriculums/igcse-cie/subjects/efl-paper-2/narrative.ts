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
  Vocabulary?: Criteria;
  Register?: Criteria;
  Grammar?: Criteria;
  "Overall Impression"?: string;
}

export const narrativeEssay = new BaseEssayQuestion(
  "Narrative",
  "narrative",
  [
    {
      name: "Content",
      description:
        "Articulate experience and express what is thought, felt and imagined",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Content is complex, engaging and effective. The plot is well-defined and strongly developed with features of fiction writing such as description, characterisation and effective climax, and convincing details.",
        },
        {
          level: "5",
          text: "Content is developed, engaging and effective. The plot is defined and developed with features of fiction writing such as description, characterisation, climax and details",
        },
        {
          level: "4",
          text: "Content is relevant with some development. The plot is relevant and cohesive, with some features such as characterisation and setting of scene",
        },
        {
          level: "3",
          text: "Content is straightforward and briefly developed. The plot is straightforward, with limited use of the features of narrative writing",
        },
        {
          level: "2",
          text: "Content is simple, and ideas and events may be limited. The plot is a simple narrative that may consist of events that are only partially linked and/or which are presented with partial clarity",
        },
        {
          level: "1",
          text: "Content is occasionally relevant or clear. The plot and/or narrative lacks coherence.",
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
          text: "Structure is secure, well balanced and carefully managed for deliberate effect",
        },
        {
          level: "5",
          text: "Structure is well managed, with some choices made for deliberate effect.",
        },
        {
          level: "4",
          text: "Structure is competently managed.",
        },
        {
          level: "3",
          text: "Structure is mostly organised but may not always be effective.",
        },
        {
          level: "2",
          text: "Structure is partially organised but limited in its effect",
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
    {
      name: "Vocabulary",
      description:
        "Use a range of vocabulary and sentence structures appropriate to context",
      marks: 5,
      levels: [
        {
          level: "6",
          text: "Precise, well-chosen vocabulary and varied sentence structures, chosen for effect",
        },
        {
          level: "5",
          text: "Mostly precise vocabulary and a range of sentence structures mostly used for effect",
        },
        {
          level: "4",
          text: "Some precise vocabulary and a range of sentence structures sometimes used for effect.",
        },
        {
          level: "3",
          text: "Simple vocabulary and a range of straightforward sentence structures.",
        },
        {
          level: "2",
          text: "Limited and/or imprecise vocabulary and sentence structures.",
        },
        {
          level: "1",
          text: "Frequently imprecise vocabulary and sentence structures.",
        },
        {
          level: "0",
          text: "No creditable content",
        },
      ],
    },
    // {
    //   name: "Register",
    //   description: "Use register appropriate to context",
    //   marks: 5,
    //   levels: [
    //     {
    //       level: "6",
    //       text: "Highly effective register for audience and purpose",
    //     },
    //     {
    //       level: "5",
    //       text: "Effective register for audience and purpose",
    //     },
    //     {
    //       level: "4",
    //       text: "Sometimes effective register for audience and purpose",
    //     },
    //     {
    //       level: "3",
    //       text: "Some awareness of an appropriate register for audience and purpose",
    //     },
    //     {
    //       level: "2",
    //       text: "Limited awareness of appropriate register for audience and purpose",
    //     },
    //     {
    //       level: "1",
    //       text: "Very limited awareness of appropriate register for audience and purpose",
    //     },
    //     {
    //       level: "0",
    //       text: "No creditable content",
    //     },
    //   ],
    // },
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

    const vocabularyLevel = Number(answerResponse.Vocabulary?.level ?? "0");
    const vocabularyMarks =
      (vocabularyLevel / 6) *
      (criteria.find((criterion) => criterion.name == "Vocabulary")?.marks ??
        5);

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
      Vocabulary: vocabularyMarks,
      Register: registerMarks,
      Grammar: grammarMarks,
    };

    const marks =
      expressionMarks +
      organizationMarks +
      vocabularyMarks +
      registerMarks +
      grammarMarks;

    await updateEssayAnswer(
      prisma,
      criteriaMarks,
      answer,
      answerResponse,
      marks
    );

    return marks;
  }
);

interface CriteriaMarks {
  Expression: number;
  Organization: number;
  Vocabulary: number;
  Register: number;
  Grammar: number;
}
const updateEssayAnswer = async (
  prisma: PrismaClient,
  criteriaMarks: CriteriaMarks,
  essayAnswer: EssayAnswer,
  response: Response,
  marks: number
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

  await prisma.essayAnswer.update({
    where: {
      id: essayAnswer?.id,
    },
    data: {
      marks: marks,
    },
  });
};
