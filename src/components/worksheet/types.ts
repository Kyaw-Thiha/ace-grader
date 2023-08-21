interface Choice {
  index: number;
  text: string;
}
interface Image {
  url: string;
  fileKey: string;
  caption: string;
}
interface CreateMCQ {
  order: number;
  questionType: "MultipleChoiceQuestion";
  multipleChoiceQuestion: {
    create: {
      text: string;
      explanation: string;
      marks: number;
      answer: number;
      choices: {
        create: Choice[];
      };
      images: {
        create: Image[];
      };
    };
  };
}
interface CreateOpenEnded {
  order: number;
  questionType: "OpenEndedQuestion";
  openEndedQuestion: {
    create: {
      text: string;
      marks: number;
      markingScheme: string[];
      explanation: string;
      sampleAnswer: string;
      images: {
        create: Image[];
      };
    };
  };
}
interface CreateEssay {
  order: number;
  questionType: "EssayQuestion";
  essayQuestion: {
    create: {
      text: string;
      criteria: {
        create: EssayCriteria[];
      };
      images: {
        create: Image[];
      };
    };
  };
}
export type EssayCriteriaName =
  | "Grammar"
  | "Focus"
  | "Exposition"
  | "Organization"
  | "Plot"
  | "Narrative Techniques"
  | "Language and Vocabulary"
  | "Content";
export interface EssayCriteria {
  name: EssayCriteriaName;
  marks: number;
}
interface CreateNestedQuestion {
  order: number;
  questionType: "NestedQuestion";
  nestedQuestion: {
    create: {
      text: string;
      images: {
        create: Image[];
      };
      childrenQuestions: {
        create: CreateQuestion[];
      };
    };
  };
}
export type CreateQuestion =
  | CreateMCQ
  | CreateOpenEnded
  | CreateEssay
  | CreateNestedQuestion;
