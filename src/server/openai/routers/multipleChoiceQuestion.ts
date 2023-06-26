import openai from "../openai";
import type { RouterOutputs } from "@/utils/api";
import { convertIntegerToASCII } from "@/utils/helper";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
const generateExplanation = (question: MultipleChoiceQuestion) => {
  const explanationPrompt = `
  Act as a teacher writing down an explanation for a 10th grade student.
  Reference each choices and explain why they are correct or wrong.
  ###
  Question: ${question?.text ?? ""}
  ${
    question?.choices
      .map((choice) => {
        return `${convertIntegerToASCII(choice.index)}: ${choice.text}`;
      })
      .join("\n") ?? ""
  }
  Answer: ${convertIntegerToASCII(question?.answer ?? 0)}
  Explanation:`;

  return openai.createCompletion({
    model: "text-davinci-003",
    prompt: explanationPrompt,
    temperature: 1,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

export const multipleChoiceQuestion = {
  generateExplanation,
};
