interface BaseEssayCriteria {
  name: string;
  marks: number;
}

interface Question {
  promptText: string;
  criteria: BaseEssayCriteria[];
  properties: string[];
  checkAnswer: (data: string) => number;
}

export class BaseEssayQuestion {
  public name: string;
  public label: string;
  public curriculum: string;
  public question: Question;

  constructor(
    name: string,
    label: string,
    curriculum: string,
    question: Question
  ) {
    this.name = name;
    this.label = label;
    this.curriculum = curriculum;
    this.question = question;
  }
}

export class BaseEssayQuestionManager {
  public questions: BaseEssayQuestion[];

  constructor(questions: BaseEssayQuestion[]) {
    this.questions = questions;
  }

  public getByCurriculum(curriculum: string) {
    return this.questions.filter((obj) => {
      return obj.curriculum === curriculum;
    });
  }
}
