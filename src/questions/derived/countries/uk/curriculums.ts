import { igcseSubjects } from "./curriculums/igcse/subjects";
export const ukCurriculums = [
  {
    label: "Default",
    value: "default",
    subjects: [{ label: "Default", value: "default" }],
  },
  {
    label: "IGCSE",
    value: "igcse",
    subjects: igcseSubjects,
  },
];
