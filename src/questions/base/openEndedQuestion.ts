import { BaseQuestion } from "@/questions/base/baseQuestion";

export class BaseOpenEndedQuestion extends BaseQuestion {
  constructor(name: string, value: string) {
    super(name, value, "open-ended");
  }
}
