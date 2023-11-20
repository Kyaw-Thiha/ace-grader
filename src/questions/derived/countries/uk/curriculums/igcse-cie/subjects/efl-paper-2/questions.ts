import { arguementativeEssay } from "./arguementative";
import { narrativeEssay } from "./narrative";
import { descriptiveEssay } from "./descriptive";
import { defaultMultipleChoiceQuestion } from "@/questions/defaults/multipleChoiceQuestion";
import { defaultOpenEndedQuestion } from "@/questions/defaults/openEndedQuestion";

export const eflPaper2Questions = [
  arguementativeEssay,
  narrativeEssay,
  descriptiveEssay,
  defaultMultipleChoiceQuestion,
  defaultOpenEndedQuestion,
];
