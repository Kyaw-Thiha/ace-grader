import { countries } from "@/questions/derived/countries";

/**
 * The parameter questionType will be in the format of country_curriculum_subject_question
 *
 * Eg: uk_igcse-cie_business-paper-1_question-d
 *
 * @param questionType
 * @returns
 */
export const getQuestionType = (questionType: string) => {
  const keyword = "_";
  const parts = questionType.split(keyword);
  if (parts.length != 4) {
    return;
  }
  const country = parts[0];
  const curriculum = parts[1];
  const subject = parts[2];
  const questionText = parts[3];

  const question = countries
    .find((e) => e.value == country)
    ?.curriculums.find((e) => e.value == curriculum)
    ?.subjects.find((e) => e.value == subject)
    ?.questions.find((e) => e.value == questionText);

  return question;
};
