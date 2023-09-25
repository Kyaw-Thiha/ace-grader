import {
  BaseEssayQuestion,
  type EssayAnswer,
} from "@/questions/base/essayQuestion";

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
  async (answer: EssayAnswer, data: string) => {
    return Promise.resolve(Math.random());
  }
);
