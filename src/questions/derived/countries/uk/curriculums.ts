import { igcseCIESubjects } from "./curriculums/igcse-cie/subjects";
export const ukCurriculums = [
  {
    label: "Default",
    value: "default",
    subjects: [{ label: "Default", value: "default", questions: [] }],
  },
  {
    label: "IGCSE CIE",
    value: "igcse-cie",
    subjects: igcseCIESubjects,
  },
];
