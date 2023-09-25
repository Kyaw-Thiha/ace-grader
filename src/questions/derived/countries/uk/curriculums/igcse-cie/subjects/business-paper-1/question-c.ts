import { BaseEssayQuestion } from "@/questions/base/essayQuestion";

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
  (data: string) => {
    return 10;
  }
);
