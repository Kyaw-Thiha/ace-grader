import { BaseMultipleChoiceQuestion } from "../base/multipleChoiceQuestion";

export const defaultMultipleChoiceQuestion = new BaseMultipleChoiceQuestion(
  "MCQ",
  "default-MCQ",
  [
    {
      index: 1,
      text: "Choice-A",
    },
    {
      index: 2,
      text: "Choice-B",
    },
    {
      index: 3,
      text: "Choice-C",
    },
    {
      index: 4,
      text: "Choice-D",
    },
  ]
);
