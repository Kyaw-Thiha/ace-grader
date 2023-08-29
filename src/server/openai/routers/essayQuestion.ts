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

  const grammar =
    getMarks("Grammar") == 0
      ? ""
      : `
  Grammar Checking (${getMarks("Grammar")} marks):
  Evaluate the essay's grammatical accuracy, sentence structure, and proper use of punctuation and spelling.
  `;

  const focus =
    getMarks("Focus") == 0
      ? ""
      : `
      Focus (${getMarks("Focus")} marks):
      Assess whether the essay maintains a clear and consistent focus on the chosen topic or subject matter. Consider whether the essay stays on point throughout.
  `;

  const exposition =
    getMarks("Exposition") == 0
      ? ""
      : `
      Exposition (${getMarks("Grammar")} marks):
      Evaluate the effectiveness of the introduction in capturing the reader's attention and providing necessary context for the essay's content.
  `;

  const organization =
    getMarks("Organization") == 0
      ? ""
      : `
      Organization (${getMarks("Organization")} marks):
      Assess the logical flow and organization of ideas within the essay. Consider the coherence of paragraphs and transitions between different sections.
  `;

  const sentenceStructure =
    getMarks("Sentence Structure") == 0
      ? ""
      : `
      Sentence Structure & Syntax (${getMarks("Sentence Structure")} marks):
      Assess the variety and effectiveness of sentence structures and syntax used in the essay. Consider the balance between simple and complex sentences, and evaluate how well the syntax contributes to the essay's readability and engagement.
  `;

  const plot =
    getMarks("Plot") == 0
      ? ""
      : `
      Plot (${getMarks("Plot")} marks):
      If applicable, evaluate the development and coherence of the essay's plot or storyline. Consider its relevance to the overall theme and how well it engages the reader.
  `;

  const narrativeTechniques =
    getMarks("Narrative Techniques") == 0
      ? ""
      : `
      Narrative Techniques (${getMarks("Narrative Techniques")} marks):
      Evaluate the adeptness of the essay's employment of narrative techniques to craft a compelling and immersive storytelling experience. Analyze the use of imagery, dialogue, descriptive language, pacing, and narrative voice. Consider how these techniques contribute to the reader's engagement, emotional connection, and overall understanding of the narrative.
  `;

  const descriptiveTechniques =
    getMarks("Descriptive Techniques") == 0
      ? ""
      : `
      Descriptive Techniques (${getMarks("Descriptive Techniques")} marks):
      Analyze the use of rich and evocative language, sensory details, and the ability to paint a clear mental picture for the reader. Consider how these techniques contribute to the depth, atmosphere, and immersive quality of the descriptive elements in the writing.
  `;

  const literaryDevices =
    getMarks("Literary Devices") == 0
      ? ""
      : `
      Use of Literary Devices (${getMarks("Literary Devices")} marks):
      Evaluate the incorporation of literary devices like similes, metaphors, and other figurative language in the essay. Assess their relevance, impact, and contribution to the overall quality of the writing.
  `;

  const languageAndVocabulary =
    getMarks("Language and Vocabulary") == 0
      ? ""
      : `
      Language and Vocabulary (${getMarks("Language and Vocabulary")} marks):
      Evaluate the richness and appropriateness of the language used. Consider the diversity of vocabulary and its contribution to the overall quality of the essay.
  `;

  const content =
    getMarks("Content") == 0
      ? ""
      : `
      Content (${getMarks("Content")} marks):
      Assess the depth and accuracy of the essay's content in relation to the chosen topic. Consider whether the essay demonstrates a comprehensive understanding of the subject matter.
  `;

  const persuasion =
    getMarks("Persuasion") == 0
      ? ""
      : `
      Persuasion (${getMarks("Persuasion")} marks):
      Evaluate the essay's ability to persuade and convince the reader in argumentative or persuasive writings. Analyze the strength of the arguments presented, the use of evidence, and the logical progression of ideas.
  `;

  const purpose =
    getMarks("Purpose") == 0
      ? ""
      : `
      Purpose (${getMarks("Purpose")} marks) (Audience Awareness):
      Assess the awareness of the essay's form, intended audience, and purpose. Consider how well the writing aligns with the chosen form and effectively communicates with the target audience while fulfilling the intended purpose.
  `;

  const correctRegister =
    getMarks("Correct Register") == 0
      ? ""
      : `
      Correct Register (${getMarks("Correct Register")} marks):
      Evaluate the use of appropriate language register in the essay. Assess whether the level of formality or informality is suitable for the intended audience and purpose, and whether it enhances the overall communication.
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

  ${sentenceStructure}

  ${plot}

  ${narrativeTechniques}

  ${descriptiveTechniques}

  ${literaryDevices}

  ${languageAndVocabulary}

  ${content}

  ${persuasion}

  ${purpose}

  ${correctRegister}

  Total Score: [Total Score Here]

  Evaluation and Suggestion:
  [Provide specific evaluation and improvement suggestion on each criterion, highlighting strengths and areas for improvement.]

  Overall Impression:
  [Share an overall impression of the essay, discussing its strengths and suggesting ways it could be further enhanced.]

  Please complete the grading process by assigning scores to each criterion and providing constructive comments to help the student improve their writing skills.
  The response should be in the following format - 
  {
      "Grammar": {
          marks: (number),
          evaluation: (string),
          suggestion: (string)
      }, ...
      "Overall Impression": (string)
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
