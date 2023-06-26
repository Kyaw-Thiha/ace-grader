import openai from "../openai";
import type { RouterOutputs } from "@/utils/api";

type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];
const generateExplanation = (question: LongAnswerQuestion) => {
  const markingScheme = question?.markingScheme as string[];
  const prompt = `
  Act as a teacher writing down an explanation for a 10th grade student.
  \nIt will be used as reference by students to learn from.
  \n\nQuestion: ${question?.text ?? ""}
  \nMarking Scheme: ${
    markingScheme
      .map((marking) => {
        return marking;
      })
      .join("\n") ?? ""
  }
  \nExplanation:
  `;

  return openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 1.05,
  });
};

const generateSampleAnswer = (question: LongAnswerQuestion) => {
  const markingScheme = question?.markingScheme as string[];
  const prompt = `
  Act as a teacher writing down a short and concise sample answer in one paragraph.
  \nIt will be used as reference by students to learn from.
  \n\nQuestion: ${question?.text ?? ""}
  \nMarking Scheme: ${
    markingScheme
      .map((marking) => {
        return marking;
      })
      .join("\n") ?? ""
  }
  \nSample Answer:
  `;
  return openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

export const longAnswerQuestion = {
  generateExplanation,
  generateSampleAnswer,
};
