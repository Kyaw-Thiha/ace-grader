interface BaseMultipleChoiceQuestionOption {
  index: number;
  text: string;
}

export class BaseMultipleChoiceQuestion {
  public name: string;
  public curriculum: string;
  public choices: BaseMultipleChoiceQuestionOption[];

  constructor(
    name: string,
    curriculum: string,
    choices: BaseMultipleChoiceQuestionOption[]
  ) {
    this.name = name;
    this.curriculum = curriculum;
    this.choices = choices;
  }

  generateZod(): string {
    // Generate some representation of the question, e.g., as a string
    return `Question: ${this.name}\nCurriculum: ${
      this.curriculum
    }\nOptions: ${this.choices.join(", ")}`;
  }

  checkAnswer(answer: number): boolean {
    return false;
  }
}
