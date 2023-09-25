import { igcseCIESubjects } from "./curriculums/igcse-cie/subjects";
export const ukCurriculums = [
  {
    label: "Custom",
    value: "custom",
    subjects: [{ label: "Custom", value: "custom", questions: [] }],
  },
  {
    label: "IGCSE CIE",
    value: "igcse-cie",
    subjects: igcseCIESubjects,
  },
];
