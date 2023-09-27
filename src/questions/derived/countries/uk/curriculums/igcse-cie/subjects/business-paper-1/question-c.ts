import {
  BaseEssayQuestion,
  type EssayAnswer,
} from "@/questions/base/essayQuestion";

import type { PrismaClient } from "@prisma/client";

export const questionC = new BaseEssayQuestion(
  "Question C",
  "question-c",
  [
    {
      name: "Knowledge",
      description: "",
      marks: 2,
    },
  ],
  [],
  async (prisma: PrismaClient, answer: EssayAnswer, data: string) => {
    return Promise.resolve(Math.random());
  }
);
