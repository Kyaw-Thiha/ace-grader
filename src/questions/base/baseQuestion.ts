export class BaseQuestion {
  public name: string;
  public value: string;
  public baseType: string;

  constructor(name: string, value: string, baseType: string) {
    this.name = name;
    this.value = value;
    this.baseType = baseType;
  }
}
