import openai from "../openai";
import type { RouterOutputs } from "@/utils/api";

type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];
type LongAnswerQuestionAnswer =
  RouterOutputs["longAnswerQuestionAnswer"]["get"];

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

const generateMarksAndFeedback = (
  question: LongAnswerQuestion,
  answer: LongAnswerQuestionAnswer
) => {
  const markingScheme = question?.markingScheme as string[];
  const prompt = `
  Give one mark each for satisfying each point in the marking scheme. Give the mark in whole number. Give feedback for your marking in one short paragraph.
  Question: Explain how mineral ions enter a plant.
  Total Mark: 3
  Marking Scheme: 
  into the root hair (cell) ;
  by active transport ; 
  against a concentration gradient / AW ;
  using energy ;
  using carrier proteins (in the cell membrane) ; 
  (also / initially) by diffusion 
  
  Answer: 
  The mineral ions enter the plant through the root hair cells by the mean of active transport
  Mark: 2
  Feedback:
  The answer correctly states that mineral ions enter the plant through the root hair cells via active transport, satisfying one of the criteria. However, it does not mention the other key points of the marking scheme, such as movement against a concentration gradient, the use of energy, the involvement of carrier proteins, or the initial role of diffusion. As a result, it only satisfies two out of the five criteria mentioned, resulting in a mark of 2 out of 3.
  
  Question: Outline how the process of in vitro fertilisation (IVF) differs from artificial insemination (AI)
  Total Mark: 2
  Marking Scheme: 
  gametes collected from both parents / eggs harvested or collected ; 
  fertilisation occurs, outside the body / in a dish / not in oviduct ; 
  fertilisation can occur by injecting sperm into the egg ; 
  embryo inserted ; 
  more invasive / surgical procedure (in reference to egg collection) ;
  Answer: 
  The gametes are collected from both parents. Fertilisation occurs ouside the body in a lab by injecting sperm into an egg. The embryo is then inserted back into the mother's uterus. This may involve surgical procedure.
  Mark: 2
  Feedback: The response addresses all the points in the marking scheme. It mentions that gametes are collected from both parents, fertilization occurs outside the body by injecting sperm into the egg, the embryo is inserted back into the mother's uterus, and acknowledges that the procedure may involve surgical methods. Therefore, the answer satisfies all the criteria and earns a mark of 2 out of 2.
  
  Question: ${question?.text ?? ""}
  Total Mark: ${question?.marks ?? 0}
  Marking Scheme: ${
    markingScheme
      .map((marking) => {
        return marking;
      })
      .join("\n") ?? ""
  }
  
  Answer: ${answer?.studentAnswer ?? ""}
  Mark:`;

  return openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

export const longAnswerQuestion = {
  generateExplanation,
  generateSampleAnswer,
  generateMarksAndFeedback,
};
