import openai from "../openai";
import type { RouterOutputs } from "@/utils/api";

type EssayQuestion = RouterOutputs["essayQuestion"]["get"];
type EssayAnswer = RouterOutputs["essayAnswer"]["get"];

const generateMarksAndFeedback = (
  question: EssayQuestion,
  answer: EssayAnswer
) => {
  const getMarks = (name: string) => {
    return question?.criteria.find((x) => x.name == name)?.marks ?? 0;
  };

  const grammar = getMarks("Grammar")
    ? ""
    : `
  Grammar Checking (${getMarks("Grammar")} marks):
  Evaluate the essay's grammatical accuracy, sentence structure, and proper use of punctuation and spelling.
  `;

  const focus =
    question?.criteria.find((x) => x.name == "Focus")?.marks ?? 0
      ? ""
      : `
      Focus (${
        question?.criteria.find((x) => x.name == "Focus")?.marks ?? 0
      } marks):
      Assess whether the essay maintains a clear and consistent focus on the chosen topic or subject matter. Consider whether the essay stays on point throughout.
  `;

  const exposition = getMarks("Exposition")
    ? ""
    : `
      Exposition (${getMarks("Grammar")} marks):
      Evaluate the effectiveness of the introduction in capturing the reader's attention and providing necessary context for the essay's content.
  `;

  const organization = getMarks("Organization")
    ? ""
    : `
      Organization (${getMarks("Organization")} marks):
      Assess the logical flow and organization of ideas within the essay. Consider the coherence of paragraphs and transitions between different sections.
  `;

  const plot = getMarks("Plot")
    ? ""
    : `
      Plot (${getMarks("Plot")} marks):
      If applicable, evaluate the development and coherence of the essay's plot or storyline. Consider its relevance to the overall theme and how well it engages the reader.
  `;

  const narrativeTechniques = getMarks("Narrative Techniques")
    ? ""
    : `
      Narrative Techniques (${getMarks("Narrative Techniques")} marks):
      Analyze the essay's use of narrative techniques, such as imagery, dialogue, and descriptive language, to enhance the storytelling and reader's experience.
  `;

  const languageAndVocabulary = getMarks("Language and Vocabulary")
    ? ""
    : `
      Language and Vocabulary (${getMarks("Language and Vocabulary")} marks):
      Evaluate the richness and appropriateness of the language used. Consider the diversity of vocabulary and its contribution to the overall quality of the essay.
  `;

  const content = getMarks("Content")
    ? ""
    : `
      Content (${getMarks("Content")} marks):
      Assess the depth and accuracy of the essay's content in relation to the chosen topic. Consider whether the essay demonstrates a comprehensive understanding of the subject matter.
  `;

  const systemPrompt = `
  You are AceGrader, an advanced AI-powered tool designed to automate the grading process for teachers.

  Question:
  ${question?.text ?? ""}

  Essay Grading Rubric:

  ${grammar}

  ${focus}

  ${exposition}

  ${organization}

  ${plot}

  ${narrativeTechniques}

  ${languageAndVocabulary}

  ${content}

  Total Score: [Total Score Here]

  Comments and Feedback:
  [Provide specific comments and feedback on each criterion, highlighting strengths and areas for improvement.]

  Overall Impression:
  [Share an overall impression of the essay, discussing its strengths and suggesting ways it could be further enhanced.]

  Please complete the grading process by assigning scores to each criterion and providing constructive comments to help the student improve their writing skills.
  The response should be in the following format - 
  {
      'Grammar': {
          marks: (number),
          evaluation: (string),
          suggestion: (string)
      }, ...
      'Overall Impression': (string)
  }
  `;

  const userPrompt = answer?.studentAnswer;

  return openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

export const essayQuestion = {
  generateMarksAndFeedback,
};
