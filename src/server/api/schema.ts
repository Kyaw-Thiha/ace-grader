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

export const questionTypeSchema = z.union([
  z.literal("NestedQuestion"),
  z.literal("MultipleChoiceQuestion"),
  z.literal("ShortAnswerQuestion"),
  z.literal("OpenEndedQuestion"),
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
};

//Nested Answer
export const answerTypeSchema = z.union([
  z.literal("NestedQuestionAnswer"),
  z.literal("MultipleChoiceQuestionAnswer"),
  z.literal("ShortAnswerQuestionAnswer"),
  z.literal("OpenEndedQuestionAnswer"),
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
};
