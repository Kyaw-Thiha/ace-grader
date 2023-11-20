import { BaseQuestion } from "@/questions/base/baseQuestion";

interface BaseMultipleChoiceQuestionOption {
  index: number;
  text: string;
}

export class BaseMultipleChoiceQuestion extends BaseQuestion {
  public choices: BaseMultipleChoiceQuestionOption[];

  constructor(
    name: string,
    value: string,
    choices: BaseMultipleChoiceQuestionOption[]
  ) {
    super(name, value, "mcq");
    this.choices = choices;
  }
}
