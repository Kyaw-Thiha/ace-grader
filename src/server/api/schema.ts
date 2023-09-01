import { z } from "zod";

// Nested Question
export const nestedQuestionSchemaProperties = {
  text: z.string(),
  images: z.object({
    create: z.array(
      z.object({
        url: z.string(),
        fileKey: z.string(),
        caption: z.string(),
      })
    ),
  }),
};

export const multipleChoiceQuestionSchema = z.object({
  text: z.string(),
  explanation: z.string(),
  marks: z.number(),
  answer: z.number(),
  choices: z.object({
    create: z.array(
      z.object({
        index: z.number(),
        text: z.string(),
      })
    ),
  }),
  images: z.object({
    create: z.array(
      z.object({
        url: z.string(),
        fileKey: z.string(),
        caption: z.string(),
      })
    ),
  }),
});

export const openEndedQuestionSchema = z.object({
  text: z.string(),
  marks: z.number(),
  markingScheme: z.array(z.string()),
  explanation: z.string(),
  sampleAnswer: z.string(),
  images: z.object({
    create: z.array(
      z.object({
        url: z.string(),
        fileKey: z.string(),
        caption: z.string(),
      })
    ),
  }),
});

export type EssayCriteriaName =
  | "Grammar"
  | "Focus"
  | "Exposition"
  | "Organization"
  | "Sentence Structure"
  | "Plot"
  | "Narrative Techniques"
  | "Descriptive Techniques"
  | "Literary Devices"
  | "Language and Vocabulary"
  | "Content"
  | "Persuasion"
  | "Purpose"
  | "Register";
const essayCriteriaName = z.union([
  z.literal("Grammar"),
  z.literal("Focus"),
  z.literal("Exposition"),
  z.literal("Organization"),
  z.literal("Sentence Structure"),
  z.literal("Plot"),
  z.literal("Narrative Techniques"),
  z.literal("Descriptive Techniques"),
  z.literal("Literary Devices"),
  z.literal("Language and Vocabulary"),
  z.literal("Content"),
  z.literal("Persuasion"),
  z.literal("Purpose"),
  z.literal("Register"),
]);
export const essayQuestionSchema = z.object({
  text: z.string(),
  criteria: z.object({
    create: z.array(
      z.object({
        name: essayCriteriaName,
        marks: z.number(),
      })
    ),
  }),
  images: z.object({
    create: z.array(
      z.object({
        url: z.string(),
        fileKey: z.string(),
        caption: z.string(),
      })
    ),
  }),
});

export const questionTypeSchema = z.union([
  z.literal("NestedQuestion"),
  z.literal("MultipleChoiceQuestion"),
  z.literal("ShortAnswerQuestion"),
  z.literal("OpenEndedQuestion"),
  z.literal("EssayQuestion"),
]);

export const questionSchemaProperties = {
  order: z.number(),
  questionType: questionTypeSchema,
  multipleChoiceQuestion: z
    .object({
      create: multipleChoiceQuestionSchema,
    })
    .optional(),
  openEndedQuestion: z
    .object({
      create: openEndedQuestionSchema,
    })
    .optional(),
  essayQuestion: z
    .object({
      create: essayQuestionSchema,
    })
    .optional(),
};

//Nested Answer
export const answerTypeSchema = z.union([
  z.literal("NestedQuestionAnswer"),
  z.literal("MultipleChoiceQuestionAnswer"),
  z.literal("ShortAnswerQuestionAnswer"),
  z.literal("OpenEndedQuestionAnswer"),
  z.literal("EssayAnswer"),
]);

export const answerSchemaProperties = {
  order: z.number(),
  answerType: answerTypeSchema,
  multipleChoiceQuestionAnswer: z
    .object({
      create: z.object({
        studentAnswer: z.number(),
        feedback: z.string(),
      }),
    })
    .optional(),
  openEndedQuestionAnswer: z
    .object({
      create: z.object({
        studentAnswer: z.string(),
        feedback: z.string(),
      }),
    })
    .optional(),
  essayAnswer: z
    .object({
      create: z.object({
        studentAnswer: z.string(),
        overallImpression: z.string(),
        criteria: z.object({
          create: z.array(
            z.object({
              name: essayCriteriaName,
              evaluation: z.string(),
              suggestion: z.string(),
            })
          ),
        }),
      }),
    })
    .optional(),
};
