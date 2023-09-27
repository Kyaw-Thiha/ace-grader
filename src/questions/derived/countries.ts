import { ukCurriculums } from "./countries/uk/curriculums";

import { defaultMultipleChoiceQuestion } from "../defaults/multipleChoiceQuestion";
import { defaultOpenEndedQuestion } from "../defaults/openEndedQuestion";
import { defaultEssayQuestion } from "../defaults/essayQuestion";

export const countries = [
  {
    label: "Custom",
    value: "custom",
    curriculums: [
      {
        label: "Custom",
        value: "custom",
        subjects: [
          {
            label: "Custom",
            value: "custom",
            questions: [
              defaultMultipleChoiceQuestion,
              defaultOpenEndedQuestion,
              defaultEssayQuestion,
            ],
          },
        ],
      },
    ],
  },
  {
    label: "UK",
    value: "uk",
    curriculums: ukCurriculums,
  },
];
