import openai from "../openai";
import type { RouterOutputs } from "@/utils/api";

type OpenEndedQuestion = RouterOutputs["openEndedQuestion"]["get"];
type OpenEndedQuestionAnswer = RouterOutputs["openEndedQuestionAnswer"]["get"];

const generateExplanation = (question: OpenEndedQuestion) => {
  const markingScheme = question?.markingScheme as string[];

  const systemPrompt = `
  You are AceGrader, an advanced AI-powered tool designed to automate the grading process for teachers. 
  Act as a teacher writing down an explanation for a 10th grade student. 
  Ensure that explanation is not more than 200 words.
  Represent mathematical equations, chemistry and physics symbols in latex between \[ and \].
  `;
  const userPrompt = `
  Question: ${question?.text ?? ""}
  Marking Scheme: ${
    markingScheme
      .map((marking) => {
        return marking;
      })
      .join("\n") ?? ""
  }
  Explanation:
  `;

  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 1,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

const generateSampleAnswer = (question: OpenEndedQuestion) => {
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
  // return openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: prompt,
  //   temperature: 1,
  //   max_tokens: 256,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  // });
};

const generateMarksAndFeedback = (
  question: OpenEndedQuestion,
  answer: OpenEndedQuestionAnswer
) => {
  const markingScheme = question?.markingScheme as string[];
  let studentAnswer = answer?.studentAnswer;
  if (studentAnswer == "" || !studentAnswer) {
    studentAnswer = "No Answer";
  }

  const systemPrompt = `
  Assign marks based on the marking scheme provided. 
  For each point in the marking scheme that is satisfied or demonstrates similar meaning, award one whole mark. 
  If a student's answer satisfies multiple points or conveys similar meaning, give the corresponding number of marks accordingly. 
  Provide constructive feedback on the student's performance in a concise paragraph.
  Give response in the format -
  Mark: (number)
  Feedback: (string)
  `;

  const userPrompt = `
  Question: ${question?.text ?? ""}
  Total Mark: ${question?.marks ?? 0}
  Marking Scheme: ${
    markingScheme
      .map((marking) => {
        return marking;
      })
      .join("\n") ?? ""
  }
  Answer: ${studentAnswer}
  `;

  return openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
};

interface QuestionPrompt {
  question: string;
  total_marks: number;
  marking_scheme: string;
  answer: string;
}

const batchGenerateMarksAndFeedback = (
  questions: OpenEndedQuestion[],
  answers: OpenEndedQuestionAnswer[]
) => {
  const systemPrompt = `
  You are AceGrader, an advanced AI-powered tool designed to automate the grading process for teachers. 
  Your primary goal is to assist teachers in evaluating their students' worksheet answers and providing 
  constructive feedback to help students improve their performance.
  Your response should include the marks assigned to each answer and a feedback paragraph to guide the 
  student on how to enhance their response.
  For each point in the marking scheme that is satisfied or demonstrates similar meaning, award one whole mark.
  Represent mathematical equations, chemical and physics symbols in latex between \[ and \].
  Remember to consider similar meanings and various valid approaches while grading the answers. 
  Please provide your response in JSON format with a list of answers, each containing 'marks' and 'feedback' as keys.
  [
    {
      marks: (number),
      feedback: (string)
    },
    ...
  ]
  `;
  const questionsList = [] as QuestionPrompt[];

  for (let i = 0; i < questions.length; i++) {
    console.time(`Question - ${i}`);
    console.timeEnd(`Question - ${i}`);

    const question = questions[i];
    const answer = answers[i];

    const markingScheme = question?.markingScheme as string[];

    let studentAnswer = answer?.studentAnswer;
    if (studentAnswer == "" || !studentAnswer) {
      studentAnswer = "No Answer";
    }

    questionsList.push({
      question: question?.text ?? "",
      total_marks: question?.marks ?? 0,
      marking_scheme: `[
        ${
          markingScheme
            .map((marking) => {
              return marking;
            })
            .join(",") ?? ""
        }
        ]`,
      answer: studentAnswer,
    });
  }

  const userPrompt = JSON.stringify(questionsList);

  return openai.chat.completions.create({
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

export const openEndedQuestion = {
  generateExplanation,
  generateSampleAnswer,
  batchGenerateMarksAndFeedback,
  generateMarksAndFeedback,
};

const generateMarksAndFeedbackLegacy = (
  question: OpenEndedQuestion,
  answer: OpenEndedQuestionAnswer
) => {
  const markingScheme = question?.markingScheme as string[];
  let studentAnswer = answer?.studentAnswer;
  if (studentAnswer == "" || !studentAnswer) {
    studentAnswer = "No Answer";
  }

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
  
  Answer: ${studentAnswer}
  Mark:`;

  // return openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: prompt,
  //   temperature: 0,
  //   max_tokens: 256,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  // });
};
