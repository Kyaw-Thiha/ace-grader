import { ukCurriculums } from "./countries/uk/curriculums";

export const countries = [
  {
    label: "Custom",
    value: "custom",
    curriculums: [
      {
        label: "Custom",
        value: "custom",
        subjects: [{ label: "Custom", value: "custom", questions: [] }],
      },
    ],
  },
  {
    label: "UK",
    value: "uk",
    curriculums: ukCurriculums,
  },
];
