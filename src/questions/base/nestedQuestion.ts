import { BaseQuestion } from "@/questions/base/baseQuestion";

export class BaseNestedQuestion extends BaseQuestion {
  constructor(name: string, value: string) {
    super(name, value, "nested");
  }
}
