import openai from "../openai";
import type { RouterOutputs } from "@/utils/api";
import { convertIntegerToASCII } from "@/utils/helper";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];

const generateExplanation = (question: MultipleChoiceQuestion) => {
  const systemPrompt = `
  You are AceGrader, an advanced AI-powered tool designed to automate the grading process for teachers. 
  Act as a teacher writing down an explanation for a 10th grade student.
  Reference each choice and explain why they are correct or wrong in a concise manner by separating each choice with new line.
  Represent mathematical equations, chemistry and physics symbols in latex between \[ and \].
  `;
  const userPrompt = `
  Question: ${question?.text ?? ""}
  ${
    question?.choices
      .map((choice) => {
        return `${convertIntegerToASCII(choice.index)}: ${choice.text}`;
      })
      .join("\n") ?? ""
  }
  Answer: ${convertIntegerToASCII(question?.answer ?? 0)}
  Explanation:
  `;

  return openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

export const multipleChoiceQuestion = {
  generateExplanation,
};
