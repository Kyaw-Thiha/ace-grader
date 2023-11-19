import type { PrismaClient } from "@prisma/client";
import type { RouterOutputs } from "@/utils/api";
import { BaseEssayQuestion } from "../base/essayQuestion";

type EssayAnswer = RouterOutputs["essayAnswer"]["get"];

export const legacy = {
  label: "Legacy",
  value: "legacy",
  curriculums: [
    {
      label: "Legacy",
      value: "legacy",
      subjects: [
        {
          label: "Legacy",
          value: "legacy",
          questions: [
            new BaseEssayQuestion(
              "Legacy Question",
              "legacy-question",
              [
                {
                  name: "Expression",
                  description:
                    "Articulate experience and express what is thought, felt and imagined",
                  marks: 5,
                  levels: [
                    {
                      level: "6",
                      text: "Highly effective style capable of conveying subtle meaning",
                    },
                    {
                      level: "5",
                      text: "Effective style",
                    },
                    {
                      level: "4",
                      text: "Sometimes effective style",
                    },
                    {
                      level: "3",
                      text: "Inconsistent style, expression sometimes awkward but meaning clear",
                    },
                    {
                      level: "2",
                      text: "Limited style",
                    },
                    {
                      level: "1",
                      text: "Expression unclear",
                    },
                    {
                      level: "0",
                      text: "No creditable content",
                    },
                  ],
                },
                {
                  name: "Organization",
                  description:
                    "Organize and structure ideas and opinions for deliberate effect",
                  marks: 5,
                  levels: [
                    {
                      level: "6",
                      text: "Carefully structured for benefit of the reader",
                    },
                    {
                      level: "5",
                      text: "Secure overall structure, organized to help the reader",
                    },
                    {
                      level: "4",
                      text: "Ideas generally well sequenced",
                    },
                    {
                      level: "3",
                      text: "Relies on the sequence of the original text",
                    },
                    {
                      level: "2",
                      text: "Response is not well sequenced",
                    },
                    {
                      level: "1",
                      text: "Poor sequencing of ideas",
                    },
                    {
                      level: "0",
                      text: "No creditable content",
                    },
                  ],
                },
                {
                  name: "Vocabulary",
                  description:
                    "Use a range of vocabulary and sentence structures appropriate to context",
                  marks: 5,
                  levels: [
                    {
                      level: "6",
                      text: "Wide range of sophisticated vocabulary, precisely used",
                    },
                    {
                      level: "5",
                      text: "Wide range of vocabulary, used with some precision",
                    },
                    {
                      level: "4",
                      text: "Range of vocabulary is adequate and sometimes effective",
                    },
                    {
                      level: "3",
                      text: "Vocabulary is simple, limited in range or reliant on the original text",
                    },
                    {
                      level: "2",
                      text: "Limited vocabulary or words/phrases copied from the original text",
                    },
                    {
                      level: "1",
                      text: "Very limited vocabulary or copying from the original text",
                    },
                    {
                      level: "0",
                      text: "No creditable content",
                    },
                  ],
                },
                {
                  name: "Register",
                  description: "Use register appropriate to context",
                  marks: 5,
                  levels: [
                    {
                      level: "6",
                      text: "Highly effective register for audience and purpose",
                    },
                    {
                      level: "5",
                      text: "Effective register for audience and purpose",
                    },
                    {
                      level: "4",
                      text: "Sometimes effective register for audience and purpose",
                    },
                    {
                      level: "3",
                      text: "Some awareness of an appropriate register for audience and purpose",
                    },
                    {
                      level: "2",
                      text: "Limited awareness of appropriate register for audience and purpose",
                    },
                    {
                      level: "1",
                      text: "Very limited awareness of appropriate register for audience and purpose",
                    },
                    {
                      level: "0",
                      text: "No creditable content",
                    },
                  ],
                },
                {
                  name: "Grammar",
                  description:
                    "Make accurate use of spelling, punctuation and grammar",
                  marks: 5,
                  levels: [
                    {
                      level: "6",
                      text: "Spelling, punctuation and grammar almost always accurate.",
                    },
                    {
                      level: "5",
                      text: "Spelling, punctuation and grammar mostly accurate, with occasional minor errors",
                    },
                    {
                      level: "4",
                      text: "Spelling, punctuation and grammar generally accurate though with some errors",
                    },
                    {
                      level: "3",
                      text: "Frequent errors of spelling, punctuation and grammar, sometimes serious",
                    },
                    {
                      level: "2",
                      text: "Persistent errors of spelling, punctuation and grammar",
                    },
                    {
                      level: "1",
                      text: "Persistent errors in spelling, punctuation and grammar impede communication",
                    },
                    {
                      level: "0",
                      text: "No creditable content",
                    },
                  ],
                },
              ],
              [
                {
                  name: "Overall Properties",
                  description:
                    "[Share an overall impression of the essay, discussing its strengths and suggesting ways it could be further enhanced.]",
                },
              ],
              async (
                prisma: PrismaClient,
                criteria,
                answer: EssayAnswer,
                data: string
              ) => {
                return Promise.resolve(Math.random());
              }
            ),
          ],
        },
      ],
    },
  ],
};
