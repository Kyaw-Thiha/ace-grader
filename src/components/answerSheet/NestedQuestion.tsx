import { type RouterOutputs } from "@/utils/api";
import { intToAlphabet, intToRoman } from "@/utils/helper";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
// import MarkdownText from "@/components/MarkdownText";
import { type AnswerSheetStatus } from "@/utils/interface";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import MultipleChoiceQuestion from "@/components/answerSheet/MultipleChoiceQuestion";
import OpenEndedQuestion from "@/components/answerSheet/OpenEndedQuestion";

type NestedQuestion = RouterOutputs["nestedQuestion"]["get"];
type NestedQuestionAnswer = RouterOutputs["nestedQuestionAnswer"]["get"];

interface Props {
  question: NestedQuestion;
  answer?: NestedQuestionAnswer;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
  nestedLevel: number;
}

const NestedQuestion: React.FC<Props> = (props) => {
  const MAXNESTEDLEVEL = 3;
  const BASELEFTMARGIN = 8;

  const margins = {
    1: `ml-${BASELEFTMARGIN * 1}`,
    2: `ml-${BASELEFTMARGIN * 2}`,
    3: `ml-${BASELEFTMARGIN * 3}`,
  };

  const hasAnswered =
    props.status == "sample-teacherview" ||
    props.status == "checking-teacherview" ||
    props.status == "returned-teacherview" ||
    props.status == "returned-studentview";

  return (
    <div className="flex w-full flex-col">
      <CardHeader>
        <CardTitle className="whitespace-pre-line text-lg font-normal leading-relaxed">
          <Latex
            delimiters={[
              { left: "$$", right: "$$", display: true },
              { left: "\\(", right: "\\)", display: false },
              { left: "$", right: "$", display: false },
              { left: "\\[", right: "\\]", display: false },
            ]}
          >
            {props.question?.text}
          </Latex>
          {/* <MarkdownText text={props.question?.text ?? ""} /> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="my-4 flex w-full flex-col items-center justify-center gap-2">
          {props.question?.images.map((image) => {
            return (
              <div key={image.id}>
                <Image
                  src={image.url}
                  alt={image.caption}
                  width="300"
                  height="300"
                />
              </div>
            );
          })}
        </div>

        <div
          className={`${
            margins[props.nestedLevel as keyof typeof margins]
          } mt-4`}
        >
          {props.question?.childrenQuestions?.map((question) => (
            <div key={question.id} className="my-4 md:mx-8 md:rounded-md">
              <Card>
                <div className="px-2 py-4 md:px-16 md:pb-8 md:pt-4">
                  <p className="my-2 text-3xl text-slate-400">
                    {props.nestedLevel == 1 && <> {question.order}.</>}
                    {props.nestedLevel == 2 && (
                      <>{intToAlphabet(question.order)}.</>
                    )}
                    {props.nestedLevel == 3 && (
                      <>{intToRoman(question.order)}.</>
                    )}
                  </p>
                  <div>
                    {question.questionType == "MultipleChoiceQuestion" && (
                      <MultipleChoiceQuestion
                        question={question.multipleChoiceQuestion}
                        refetch={props.refetch}
                        status={props.status}
                      />
                    )}
                    {question.questionType == "OpenEndedQuestion" && (
                      <OpenEndedQuestion
                        question={question.openEndedQuestion}
                        refetch={props.refetch}
                        status={props.status}
                      />
                    )}
                    {question.questionType == "NestedQuestion" && (
                      <NestedQuestion
                        question={question.nestedQuestion}
                        refetch={props.refetch}
                        nestedLevel={props.nestedLevel + 1}
                        status={props.status}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default NestedQuestion;
