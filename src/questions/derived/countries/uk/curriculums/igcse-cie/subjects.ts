import { eflPaper2Questions } from "./subjects/efl-paper-2/questions";
import { businessPaper1Questions } from "./subjects/business-paper-1/questions";

export const igcseCIESubjects = [
  {
    label: "EFL Paper 2",
    value: "efl-paper-2",
    questions: eflPaper2Questions,
  },
  {
    label: "Business Paper 1",
    value: "business-paper-1",
    questions: businessPaper1Questions,
  },
];
