import { ukCurriculums } from "./countries/uk/curriculums";

export const countries = [
  {
    label: "Default",
    value: "default",
    curriculums: [
      {
        label: "Default",
        value: "default",
        subjects: [{ label: "Default", value: "default", questions: [] }],
      },
    ],
  },
  {
    label: "UK",
    value: "uk",
    curriculums: ukCurriculums,
  },
];
