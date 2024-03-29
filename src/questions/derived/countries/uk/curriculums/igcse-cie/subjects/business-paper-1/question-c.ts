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

export const questionC = new BaseEssayQuestion(
  "Question-C",
  "questionC",
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

    await updateEssayAnswer(prisma, criteriaMarks, answer, answerResponse);

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

// interface Criteria {
//   marks: number;
//   evaluation: string;
//   suggestion: string;
// }
// interface Property {
//   name: string;
//   text: string;
// }

// interface Response {
//   Knowledge?: Criteria;
//   Applicaiton?: Criteria;
// }

// export const questionC = new BaseEssayQuestion(
//   "Question-C",
//   "question-c",
//   [
//     {
//       name: "Knowledge",
//       description:
//         "Evaluate the answer's depth of theoretical knowledge and understanding of the relevant business concepts or lessons. Consider the accuracy and completeness of the theoretical framework presented.",
//       marks: 2,
//     },
//     {
//       name: "Application",
//       description:
//         "Assess the paper's ability to apply theoretical knowledge to real-world scenarios, particularly through reference to case studies or practical examples. Evaluate the effectiveness of these applications in illustrating the concepts discussed.",
//       marks: 2,
//     },
//   ],
//   [],
//   async (prisma: PrismaClient, answer: EssayAnswer, data: string) => {
//     const answerResponse = JSON.parse(data) as Response;

//     const marks =
//       (answerResponse.Knowledge?.marks ?? 0) +
//       (answerResponse.Applicaiton?.marks ?? 0);
//     await updateEssayAnswer(prisma, answer, answerResponse, marks);

//     return marks;
//   }
// );

// const updateEssayAnswer = async (
//   prisma: PrismaClient,
//   essayAnswer: EssayAnswer,
//   response: Response,
//   marks: number
// ) => {
//   const editCriteria = async (id: string, criteria: Criteria) => {
//     await prisma.essayAnswerCriteria.update({
//       where: {
//         id: id,
//       },
//       data: {
//         marks: criteria.marks,
//         evaluation: criteria.evaluation,
//         suggestion: criteria.suggestion,
//       },
//     });
//   };

//   const editProperty = async (id: string, property: Property) => {
//     await prisma.essayAnswerProperty.update({
//       where: {
//         id: id,
//       },
//       data: {
//         name: property.name,
//         text: property.text,
//       },
//     });
//   };

//   const criteria = essayAnswer?.criteria ?? [];
//   for (const criterion of criteria) {
//     await editCriteria(
//       criterion.id,
//       response[criterion.name as keyof Response] as Criteria
//     );
//   }

//   await prisma.essayAnswer.update({
//     where: {
//       id: essayAnswer?.id,
//     },
//     data: {
//       marks: marks,
//     },
//   });
// };
