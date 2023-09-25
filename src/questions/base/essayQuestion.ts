import { BaseQuestion } from "@/questions/base/baseQuestion";

interface BaseEssayProperty {
  name: string;
  description: string;
}
interface BaseEssayCriteria {
  name: string;
  description: string;
  marks: number;
  metadata?: string[];
}

export class BaseEssayQuestion extends BaseQuestion {
  public criteria: BaseEssayCriteria[];
  public properties: BaseEssayProperty[];
  public checkAnswer: (data: string) => number;

  constructor(
    name: string,
    value: string,
    criteria: BaseEssayCriteria[],
    properties: BaseEssayProperty[],
    checkAnswer: (data: string) => number
  ) {
    super(name, value);
    this.criteria = criteria;
    this.properties = properties;
    this.checkAnswer = checkAnswer;
  }

  public getCriteriaNames() {
    return this.criteria.map((criterion) => criterion.name);
  }
}
