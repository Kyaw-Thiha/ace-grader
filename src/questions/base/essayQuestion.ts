import { BaseQuestion } from "@/questions/base/baseQuestion";
import type { RouterOutputs } from "@/utils/api";
import type { PrismaClient } from "@prisma/client";

export type EssayAnswer = RouterOutputs["essayAnswer"]["get"];

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
  public checkAnswer: (
    prisma: PrismaClient,
    answer: EssayAnswer,
    data: string
  ) => Promise<number>;

  constructor(
    name: string,
    value: string,
    criteria: BaseEssayCriteria[],
    properties: BaseEssayProperty[],
    checkAnswer: (
      prisma: PrismaClient,
      answer: EssayAnswer,
      data: string
    ) => Promise<number>
  ) {
    super(name, value, "essay");
    this.criteria = criteria;
    this.properties = properties;
    this.checkAnswer = checkAnswer;
  }

  public getCriteria() {
    return this.criteria.map((criterion) => {
      return { name: criterion.name, description: criterion.description };
    });
  }

  public generateCriteriaAnswers() {
    return this.criteria.map((criterion) => {
      return { name: criterion.name, evaluation: "", suggestion: "" };
    });
  }

  public generateAnswerProperties() {
    return this.properties.map((property) => {
      return { name: property.name, text: "" };
    });
  }
}
