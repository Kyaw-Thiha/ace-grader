import { z } from "zod";

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

export const longAnswerQuestionSchema = z.object({
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
  z.literal("LongAnswerQuestion"),
]);

export const questionSchemaProperties = {
  order: z.number(),
  questionType: questionTypeSchema,
  multipleChoiceQuestion: z
    .object({
      create: multipleChoiceQuestionSchema,
    })
    .optional(),
  longAnswerQuestion: z
    .object({
      create: longAnswerQuestionSchema,
    })
    .optional(),
};
